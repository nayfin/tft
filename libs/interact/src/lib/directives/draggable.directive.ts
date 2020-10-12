import { Directive, ElementRef, Input, OnInit, Output,
   OnDestroy, EventEmitter, Optional, SkipSelf, Renderer2, SimpleChanges, OnChanges, TemplateRef, ContentChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions, Interactable } from '@interactjs/types/index';
import { Subscription, Observable } from 'rxjs';
import { DropzoneDirective } from './dropzone.directive';
import { NgDragEvent, TftDragEvent, DEFAULT_REGISTRY_ID, TftInteractable } from '../models';
import { CdkDragPreview } from '@angular/cdk/drag-drop';
import { DragPreviewDirective, TFT_DRAG_PREVIEW } from './drag-preview.directive';
@Directive({
  selector: '[tftDraggable]',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[style.touchAction]': '"none"',
    '[style.position]': '"absolute"',
    '[id]': 'interactableId',
  }
})
export class DraggableDirective implements OnInit, OnChanges, OnDestroy, AfterViewInit {


  @Input() x: number;
  @Input() y: number;

  @Input() interactableId: string;
  @Input() dragData: any;
  @Input() enableDragDefault = true;
  @Input() disabled = false;
  @Input() dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>;

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

  dragPreview: Interact.Element;
  interactableState: Observable<TftInteractable>;
  interactable: Interactable;
  private registryId: string;

  private interactableSubscription: Subscription;

  constructor(
    public el: ElementRef,
    private interactService: InteractService,
    private renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef,
    @Optional() @SkipSelf() public dropzone_dir?: DropzoneDirective
  ) {
   }

  ngOnInit() {
    this.interactable = this.initiateDragEvents(this.dragConfig, this.el.nativeElement);

    // register with parent dropzone if it exists, otherwise use default
    this.registryId = this.dropzone_dir?.dropzoneId || DEFAULT_REGISTRY_ID;
    // add draggable to directory and store its id
    this.interactableId = this.interactService.addDraggableToRegistry(this.registryId, this.interactableId);
    // cache subscription to interactable state so we can unsubscribe onDestroy
    this.interactableState = this.interactService
      .getInteractableState(this.interactableId, this.registryId);

    // we create a property 'dragRef' on the element so that we can easily pass the class instance to the drop zone
    // Set our target and origin to the parent zone, since we're starting here

    this.addDragPropertiesToElement(this.el.nativeElement)
    this.alignPositionWithInputs(this.x, this.y);
    // keep our cached position values in line with our drag state
    this.interactableSubscription = this.interactableState.subscribe((state) => {
      this.y = state.y;
      this.x = state.x;
    });
  };
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
    const preview = this._previewTemplate ? {
      template: this._previewTemplate.templateRef,
      viewContainer: this._viewContainerRef
    } : null;
    const viewRef = preview?.viewContainer.createEmbeddedView(preview.template);
    console.log( 'preview', this._previewTemplate?.templateRef.elementRef.nativeElement, 'viewRef', viewRef)
  }

  ngOnDestroy() {
    // clean up state and subscriptions related to destroyed component
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

  addDragPropertiesToElement(nativeElement: any) {
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
      dropTarget: this.el.nativeElement.dropTarget,
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
    return typeof num === 'number' && num !== NaN;
  }

  initiateDragEvents(dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>, nativeElement: HTMLElement) {
    return interact(nativeElement).draggable({ manualStart: !!this.dropzone_dir, ...dragConfig })
      .on('dragstart',  (event: NgDragEvent) => {
          this.dragStart.emit(this.mapDragEvent(event));
      })
      .on('move', (event: NgDragEvent) => {
        const interaction = event.interaction;
        if (!!this.dropzone_dir && interaction.pointerIsDown && !interaction.interacting()) {
          this.dragPreview = this.cloneElement(this.el.nativeElement);
          this.addDragPropertiesToElement(this.dragPreview);
          const elementRect = nativeElement.getBoundingClientRect();
          const bodyRect = document.body.getBoundingClientRect();
          const x = elementRect.x - bodyRect.x;
          const y = elementRect.y - bodyRect.y;

          document.body.prepend(this.dragPreview);
          this.interactService.updatePosition(this.interactableId, this.registryId, {x, y}, this.dragPreview);
          interaction.start(
            { name: 'drag' },
            event.interactable,
            this.dragPreview
          );
        }
      })
      .on('dragmove', (event: NgDragEvent) => {
        if (this.enableDragDefault) {
          const dragElement = this.dropzone_dir && this.dragPreview || nativeElement
          this.dragMoveListener(event, dragElement);
        }

        const mappedEvent = this.mapDragEvent(event);
        this.dragMove.emit(mappedEvent);
      })
      .on('draginertiastart', (event: NgDragEvent) => {
        this.dragInertiaStart.emit(this.mapDragEvent(event))
      })
      .on('dragend', (event: NgDragEvent) => {
        this.dragEnd.emit(this.mapDragEvent(event))
        if(this.dropzone_dir && this.dragPreview) {
          setTimeout(() => {
            document.body.removeChild(this.dragPreview);
            this.dragPreview = null;
          }, 0)
        }
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
