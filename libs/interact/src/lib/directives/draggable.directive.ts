import { Directive, ElementRef, Input, OnInit, Output,
   OnDestroy, EventEmitter, Optional, SkipSelf, Renderer2, SimpleChanges, OnChanges, ContentChild, ViewContainerRef, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions, Interactable } from '@interactjs/types/index';
import { Subscription, Observable } from 'rxjs';
import { DropzoneDirective } from './dropzone.directive';
import { NgDragEvent, TftDragEvent, DEFAULT_REGISTRY_ID, TftCoords, TftDragElement} from '../models';
import { DragPreviewDirective } from './drag-preview.directive';
import { getRootNode } from '../utils';
@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
    '[id]': 'interactableId',
  }
})
export class DraggableDirective<D = any> implements OnInit, OnChanges, OnDestroy, AfterViewInit {


  @Input() x: number;
  @Input() y: number;
  /* zIndex while dragging*/
  @Input() dragZIndex = 10000;
  /** zIndex while at rest */
  @Input() zIndex: number
  @Input() interactableId: string;
  @Input() dragData: D;
  @Input() enableDragDefault = true;
  @Input() disabled = false;
  @Input() dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>;
  @Input() showPlaceholder = false;
  // pipes all interact events to event emitters
  @Output() dragStart = new EventEmitter<TftDragEvent>();
  @Output() dragMove = new EventEmitter<TftDragEvent>();
  @Output() dragInertiaStart = new EventEmitter<TftDragEvent>();
  @Output() dragEnd = new EventEmitter<TftDragEvent>();
  /**
   * Experimental!!: This API will change frequently or may be removed all together
   * Used to pass an alternate template to drag
   */
  @ContentChild(DragPreviewDirective) _previewTemplate: DragPreviewDirective;

  // dragPreview: Interact.Element;
  interactableState: Observable<TftCoords>;
  interactable: Interactable;
  private registryId: string;

  private interactableSubscription: Subscription;
  // cache holding element to use as drag preview (the element the user sees being dragged around)
  private previewRef: TftDragElement;
  // cache holding element to use as placeholder while dragging
  constructor(
    public el: ElementRef,
    private interactService: InteractService,
    private renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private _document: Document,
    @Optional() @SkipSelf() public dropzone_dir?: DropzoneDirective
  ) { }

  ngOnInit() {
    this.interactable = this.initiateDragEvents(this.dragConfig, this.el.nativeElement);

    // register with parent dropzone if it exists, otherwise use default
    // this gives us a place on the registry to store our drag items that don't have a dropzone
    this.registryId = this.dropzone_dir?.dropzoneId || DEFAULT_REGISTRY_ID;
    // add draggable to directory and store its id
    this.interactableId = this.interactService.addDraggableToRegistry(this.registryId, this.interactableId);
    this.alignPositionWithInputs(this.x, this.y);
    // cache subscription to interactable state so we can unsubscribe onDestroy
    this.interactableState = this.interactService
      .getInteractableState(this.interactableId, this.registryId);
    // keep our cached position values in line with our drag state
    this.interactableSubscription = this.interactableState.subscribe((state) => {
      this.y = state.y;
      this.x = state.x;
    });
  }

  // TODO: watch config here as well and update interactable
  ngOnChanges(changes: SimpleChanges) {
    // we do this here instead of using a setter on the input so that it
    // will only run once when there is a change to x and y
    if(changes.y || changes.x) {
      this.alignPositionWithInputs(this.x, this.y);
    }
    if(changes.dragConfig) {
      if(!this.interactable) return;
      this.interactable.draggable(this.dragConfig);
    }
  }

  ngAfterViewInit() {
    if (!this.dropzone_dir) {
      this.previewRef = this.el.nativeElement;
      return;
    }
    if (this._previewTemplate) {
      const viewRef = this._viewContainerRef.createEmbeddedView(this._previewTemplate.templateRef);
      this.previewRef = getRootNode(viewRef, this._document);
    } else {
      this.previewRef = this.cloneElement(this.el.nativeElement);
    }
    this._document.body.prepend(this.previewRef);
    this.renderer.setStyle(this.previewRef, 'display', 'none');

    this.addDragPropertiesToElement(this.previewRef);
  }

  ngOnDestroy() {
    // clean up state and subscriptions related to destroyed component
    this._document.removeChild(this.previewRef)
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this.interactableId, this.registryId);
  }

  dragMoveListener(event: NgDragEvent, element: Interact.Element) {
    const { dx, dy } = event;
    this.interactService.updateDeltas(
      this.interactableId,
      this.registryId,
      {deltaX: dx, deltaY: dy},
      element
    );
  }

  setDragStyles(dragElement: HTMLElement) {
    this.renderer.setStyle(dragElement, 'touchAction', 'none')
    this.renderer.setStyle(dragElement, 'zIndex', this.dragZIndex)
    this.renderer.setStyle(dragElement, 'position', 'fixed')
  }

  addDragPropertiesToElement(nativeElement: TftDragElement) {
    this.renderer.setProperty(nativeElement, 'dropTarget', this.dropzone_dir || null);
    this.renderer.setProperty(nativeElement, 'dragOrigin', this.dropzone_dir || null);
    this.renderer.setProperty(nativeElement, 'dragRef', this);
  }

  mapDragEvent(event: NgDragEvent): TftDragEvent {
    const { target, dropzone } = event;
    const dropzoneElement = dropzone?.target || target.dropTarget?.el.nativeElement;
    const positionInDropTarget = target && dropzoneElement
      ? this.interactService.calculatePositionInDropzone(dropzoneElement, target)
      : null;
    return {
      interactEvent: event,
      dragRef: this,
      dragOrigin: target.dragOrigin,
      dropTarget: this.previewRef.dropTarget,
      positionInDropTarget
    }
  }

  setPosition(x: number, y: number) {
    this.interactService.updatePosition(
      this.interactableId,
      this.registryId,
      {x, y},
      this.el.nativeElement
    );
  }

  alignPositionWithInputs(x: number, y: number) {
    // short circuit if positions aren't numbers or  if they haven't changed
    if(!this.isValidPosition(x, y)) return;
    this.interactService.updatePosition(
      this.interactableId,
      this.registryId,
      {x, y},
      this.el.nativeElement
    );
  }

  isValidPosition(x: number, y: number) {
    return this.isNumeric(x) && this.isNumeric(y);
  }
  // We use use this instead of isNaN here to try and help performance
  // We should be able to reliably restrict to numbers or falsey values
  isNumeric(num: number) {
    return typeof num === 'number' && !isNaN(num);
  }

  initiateDragEvents(dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>, nativeElement: HTMLElement) {
    return interact(nativeElement).draggable({ manualStart: !!this.dropzone_dir, ...dragConfig })
      .on('dragstart',  (event: NgDragEvent) => {
        this.dragStart.emit(this.mapDragEvent(event));
      })
      /**
       * If we want to append to body we need to set some things up from on move
       */
      .on('move', (event: NgDragEvent) => {
        // cache the interaction
        const interaction = event.interaction;
        // check if we should append drag item to body
        if ( this.enableDragDefault
            && !!this.dropzone_dir
            && interaction.pointerIsDown
            && !interaction.interacting()
        ) {
          // show the previewRef if it was hidden i.e. there is a previewTemplate
          this.renderer.setStyle(this.previewRef, 'display', 'initial');

          const elementRect = nativeElement.getBoundingClientRect();
          const bodyRect = this._document.body.getBoundingClientRect();
          const x = elementRect.x - bodyRect.x;
          const y = elementRect.y - bodyRect.y;
          this.setDragStyles(this.previewRef)
          this._document.body.prepend(this.previewRef);
          this.interactService.updatePosition(this.interactableId, this.registryId, {x, y}, this.previewRef);
          if (!this.showPlaceholder) {
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
          }
          interaction.start(
            { name: 'drag' },
            event.interactable,
            this.previewRef
          );
        }
      })
      .on('dragmove', (event: NgDragEvent) => {
        if (this.enableDragDefault) {
          const dragElement = this.dropzone_dir && this.previewRef || nativeElement
          this.dragMoveListener(event, dragElement);
        }
        const mappedEvent = this.mapDragEvent(event);
        this.dragMove.emit(mappedEvent);
      })
      .on('draginertiastart', (event: NgDragEvent) => {
        this.dragInertiaStart.emit(this.mapDragEvent(event))
      })
      .on('dragend', (event: NgDragEvent) => {
        const mappedEvent = this.mapDragEvent(event)
        this.dragEnd.emit(mappedEvent)
        if (this.previewRef) {
          this.renderer.setStyle(this.previewRef, 'display', 'none');
        }
        if(this.dropzone_dir === event.target.dropTarget) {
            const { x, y} = mappedEvent.positionInDropTarget;
            this.setPosition(x, y);
          }
          this.renderer.setStyle(this.el.nativeElement, 'display', 'initial');

      });
  }
  // TODO: this doesn't do anything yet...
  // eventually it should create a clone of the component passed
  // in and add it to the root component
  cloneElement(element: HTMLElement) {

    const clone = element.cloneNode(true) as HTMLElement;
    clone.removeAttribute('id');
    return clone;
  }

}

/**
 * Component utils
 */
function getPreviewInsertionPoint(documentRef: any): HTMLElement {
  // We can't use the body if the user is in fullscreen mode,
  // because the preview will render under the fullscreen element.
  return documentRef.fullscreenElement ||
         documentRef.webkitFullscreenElement ||
         documentRef.mozFullScreenElement ||
         documentRef.msFullscreenElement ||
         documentRef.body;
}
