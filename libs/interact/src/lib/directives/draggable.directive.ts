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
import { DragRootDirective } from './drag-root.directive';

/** @dynamic */
@Directive({
  selector: '[tftDraggable]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[style.touchAction]': 'this.dragDisabled ? "auto" : "none"',
    '[style.position]': '"absolute"',
    '[id]': 'interactableId',
  }
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  /**
   * @deprecated replaced by 'dragDisabled' property, please migrate before v13
   */
  @Input() disabled = false;
  @Input() dragDisabled = false;
  @Input() dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>;
  @Input() showPlaceholder = false;
  /**
   * The element we want to prepend the drag element to.
   * Use `tftDragRoot` directive on a parent to element to set custom root element
   *  @default document.body
   */
  dragRoot: HTMLElement;

  // pipes all interact events to event emitters
  @Output() dragStart = new EventEmitter<TftDragEvent>();
  @Output() dragMove = new EventEmitter<TftDragEvent>();
  @Output() dragInertiaStart = new EventEmitter<TftDragEvent>();
  @Output() dragEnd = new EventEmitter<TftDragEvent>();

  @ContentChild(DragPreviewDirective) _previewTemplate: DragPreviewDirective;
  // dragPreview: Interact.Element;
  interactableState: Observable<TftCoords>;
  interactable: Interactable;
  private registryId: string;
  private interactableSubscription: Subscription;
  // cache holding element to use as drag preview (the element the user sees being dragged around)
  previewRef: TftDragElement;
  // cache holding element to use as placeholder while dragging
  constructor(
    public el: ElementRef,
    private interactService: InteractService,
    private renderer: Renderer2,
    private _viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private _document: Document,
    @Optional() @SkipSelf() public dropzone_dir?: DropzoneDirective,
    @Optional() @SkipSelf() public drag_root_dir?: DragRootDirective
  ) {
    this.dragRoot = (drag_root_dir?.el?.nativeElement as HTMLElement) || this._document.body;
  }

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
    this.setDragConfig();
  }

  // TODO: watch config here as well and update interactable
  ngOnChanges(changes: SimpleChanges) {
    // we do this here instead of using a setter on the input so that it
    // will only run once when there is a change to x and y
    if(changes.y || changes.x) {
      this.alignPositionWithInputs(this.x, this.y);
    }
    if(changes.dragConfig || changes.disabled || changes.dragDisabled) {
      if(!this.interactable) return;
      this.setDragConfig();
    }
    /**
     * @deprecated remove this in v13
     */
    if (changes.disabled) {
      console.warn(`It looks like your using the 'disabled' input on a tftDraggable directive, it has been deprecated and is replaced with 'dragDisabled', please migrate by v13`)
    }
  }

  setDragConfig() {
    const enabled = !(this.disabled || this.dragDisabled)
    const dragConfig = {...this.dragConfig, enabled};
    this.interactable.draggable(dragConfig);
  }

  ngAfterViewInit() {
    this.addDragPropertiesToElement(this.el.nativeElement);
    if (!this.dropzone_dir) {
      this.previewRef = this.el.nativeElement;
    }
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
      ? this.interactService.calculatePositionInElement(dropzoneElement, this.previewRef)
      : null;
    return {
      interactEvent: event,
      dragRef: this,
      dragOrigin: target.dragOrigin,
      dropTarget: target.dropTarget,
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
    return interact(nativeElement).draggable({...dragConfig, enabled:  !(this.disabled || this.dragDisabled) })
      .on('dragstart',  (event: NgDragEvent) => {
        const interaction = event.interaction;

        // check if we should append drag element to body
        if ( this.enableDragDefault
          && !!this.dropzone_dir
          && interaction.pointerIsDown
          // && !interaction.interacting()
          ) {
          if (this._previewTemplate) {
            const viewRef = this._viewContainerRef.createEmbeddedView(this._previewTemplate.templateRef);
            this.previewRef = getRootNode(viewRef, this._document);
          } else {
            this.previewRef = cloneElement(this.el.nativeElement);
          }
          this.addDragPropertiesToElement(this.previewRef);
          this.setDragStyles(this.previewRef)

          this.dragRoot.prepend(this.previewRef);

          const {x, y} = this.interactService.calculatePositionInElement(this.dragRoot, nativeElement);
          this.interactService.updatePosition(this.interactableId, this.registryId, {x, y}, this.previewRef);
          if (!this.showPlaceholder) {
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
          }
        }
        this.dragStart.emit(this.mapDragEvent(event));
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
        if(!!this.dropzone_dir && this.dropzone_dir === event.target.dropTarget) {
          const { x, y} = mappedEvent.positionInDropTarget;
          this.setPosition(x, y);
        }
        this.renderer.setStyle(this.el.nativeElement, 'display', '');
        this.dragEnd.emit(mappedEvent);

        if ( this.el.nativeElement !== this.previewRef) {
          // we do this in a timeout, so that we don't
          // remove before the dropzone can get the boundingElementRect
          setTimeout(() => {
            this.dragRoot.removeChild(this.previewRef);
          })
        }
      });
  }


}

/**
 * Component utils
 */
// create a clone of the component passed in and add it to the root component
function cloneElement(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  return clone;
}
function getPreviewInsertionPoint(documentRef: any): HTMLElement {
  // We can't use the body if the user is in fullscreen mode,
  // because the preview will render under the fullscreen element.
  return documentRef.fullscreenElement ||
         documentRef.webkitFullscreenElement ||
         documentRef.mozFullScreenElement ||
         documentRef.msFullscreenElement ||
         documentRef.body;
}
