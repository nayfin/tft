import { Directive, OnInit, OnDestroy, ElementRef, Input, Optional, SkipSelf, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2, Inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { ResizableOptions, ResizeEvent, Interactable } from '@interactjs/types/index';
import { Subscription } from 'rxjs';
import { DraggableDirective } from './draggable.directive';
import { DropzoneDirective } from './dropzone.directive';
import { DragRootDirective } from './drag-root.directive';
import { AccountForScaleDirective } from './account-for-scale.directive';
import { NgResizeEvent, TftResizeEvent, DEFAULT_REGISTRY_ID, TftDragElement } from '../models';

/** @dynamic */
@Directive({
  selector: '[tftResizable]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    // prevents touch events from colliding with with mouse events
    // on touch screen
    '[style.touchAction]': 'this.resizeDisabled ? "auto" : "none"',
    // default to absolute here to accommodate likely use cases
    // consuming component can easily over ride with position input
    '[style.position]': 'position',
    // follows interactjs suggested practices
    '[style.boxSizing]': '"border-box"',

  }
})
export class ResizableDirective implements OnInit, OnDestroy, OnChanges {

  @Input() enableResizeDefault = true;
  // TODO: should this be an input with default or should consuming user set display in styles each time
  @Input() position = 'absolute';
  @Input() resizeConfig: Partial<Interact.OrBoolean<ResizableOptions>>;
  @Input() interactableId: string;

  @Input() width: number;
  @Input() height: number;
  @Input() resizeDisabled = false;

  @Output() resizeStart = new EventEmitter<TftResizeEvent>();
  @Output() resizeMove = new EventEmitter<TftResizeEvent>();
  @Output() resizeInertiaStart = new EventEmitter<TftResizeEvent>();
  @Output() resizeEnd = new EventEmitter<TftResizeEvent>();

  defaultConfig: Partial<Interact.OrBoolean<ResizableOptions>> = {
    edges: { left: true, right: true, bottom: true, top: true }
  };
  registryId: string;
  interactable: Interactable;
  // The
  dragRootEl: HTMLElement;

  private interactableSubscription: Subscription;
  get scale() {
    return this.account_for_scale_dir?.scale || this.drag_root_dir?.account_for_scale_dir.scale;
  }

  constructor(
    public el: ElementRef,
    @Inject(DOCUMENT) private _document: Document,
    private interactService: InteractService,
    private renderer: Renderer2,
    @Optional() private drag_root_dir?: DragRootDirective,
    @Optional() public account_for_scale_dir?: AccountForScaleDirective,
    @Optional() private draggable_dir?: DraggableDirective,
    @Optional() @SkipSelf() private dropzone_dir?: DropzoneDirective
  ) {
    this.dragRootEl = (drag_root_dir?.el?.nativeElement as HTMLElement) || this._document.body;
  }

  ngOnInit() {
    this.addResizePropertiesToElement(this.el.nativeElement);

    // we check for a dropzone, we use its id as the registry id if there is on
    // otherwise, we use DEFAULT_REGISTRY_ID as a registry id. This allows us to keep our interactable
    // drag state organized by dropzones.
    this.registryId = this.dropzone_dir?.dropzoneId || DEFAULT_REGISTRY_ID;

    this.interactableId = this.draggable_dir?.interactableId || this.interactService.addDraggableToRegistry(this.registryId, this.interactableId);

    this.interactable = this.initiateResizeEvents(
      {...this.defaultConfig, ...this.resizeConfig },
      this.el.nativeElement
    );

    this.alignDimensionsWithInputs(this.width, this.height);

    this.interactableSubscription = this.interactService
      .getInteractableState(this.interactableId, this.registryId)
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.resizeConfig || changes.resizeDisabled) && this.interactable) {
      this.interactable.resizable({...this.resizeConfig, enabled: !this.resizeDisabled,});
    }
    if (changes.width || changes.height) {
      this.alignDimensionsWithInputs(this.width, this.height);
    }
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this.interactableId, this.registryId);
  }

  resizeListener(event: ResizeEvent) {
    const scale = this.scale;
    let deltaX: number;
    let deltaY: number;
    let height: number;
    let width: number;
    if (scale) {
       deltaX = event.deltaRect.left/scale;
       deltaY = event.deltaRect.top/scale;
       height = event.rect.height/scale;
       width = event.rect.width/scale;
    } else {
       deltaX = event.deltaRect.left;
       deltaY = event.deltaRect.top;
       width = event.rect.width;
       height = event.rect.height;
    }

    this.interactService.updateSize(
      this.interactableId,
      this.registryId,
      {deltaX, deltaY, width, height},
      this.el.nativeElement
    );
  }
  /**
   *  hook elements into interacts resize event listeners
   *  we spread the configs so that the consuming component only overwrites the
   *  pieces that it explicitly indicates
   * @param resizeConfig
   * @param nativeElement
   */
  initiateResizeEvents(resizeConfig: Partial<Interact.OrBoolean<ResizableOptions>>, nativeElement: any) {
    // TODO: This should try and get interactable from tft_draggable if it exists
    const interactable = this.draggable_dir?.interactable || interact(nativeElement);
    return interactable.resizable({...resizeConfig, enabled: !this.resizeDisabled})
      .on('resizestart', (event: NgResizeEvent) => { this.resizeStart.emit(this.mapResizeEvent(event))})
      .on('resizemove',  (event: NgResizeEvent) => {
        if (this.enableResizeDefault) {
          this.resizeListener(event)
        }
        const mappedEvent = this.mapResizeEvent(event);
        this.resizeMove.emit(mappedEvent)
      })
      .on('resizeinertiastart', (event: NgResizeEvent) => this.resizeInertiaStart.emit(this.mapResizeEvent(event)))
      .on('resizeend', (event: NgResizeEvent) => this.resizeEnd.emit(this.mapResizeEvent(event)));
  }

  mapResizeEvent(event: NgResizeEvent ): TftResizeEvent {
    const target  = event.target as TftDragElement;
    const relatedTarget = this.draggable_dir?.dropzone_dir?.el.nativeElement;
    const scale = this.account_for_scale_dir?.scale || this.drag_root_dir?.account_for_scale_dir?.scale || 1;
    const positionInDropTarget = target && relatedTarget
      ? this.interactService.calculatePositionInElement(relatedTarget, target, scale)
      : null;
    return {
      interactEvent: event,
      resizeRef: this,
      dragRef: this.draggable_dir,
      dragOrigin: this.dropzone_dir,
      dropTarget: this.el.nativeElement.dropTarget,
      positionInDropTarget
    }
  }

  alignDimensionsWithInputs(width: number, height: number) {
    this.interactService.updateSize(
      this.interactableId,
      this.registryId,
      {deltaX: 0, deltaY: 0, width, height},
      this.el.nativeElement
    );
  }

  addResizePropertiesToElement(nativeElement: TftDragElement) {
    this.renderer.setProperty(nativeElement, 'resizeRef', this);
  }
}
