import { Directive, OnInit, OnDestroy, ElementRef, Input, Optional, SkipSelf, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { ResizableOptions, ResizeEvent, Interactable } from '@interactjs/types/index';
import { Subscription } from 'rxjs';
import { DraggableDirective } from './draggable.directive';
import { DropzoneDirective } from './dropzone.directive';
import { NgResizeEvent, TftResizeEvent, DEFAULT_REGISTRY_ID } from '../models';
@Directive({
  selector: '[tftResizable]',
  host: {
    // prevents touch events from colliding with with mouse events
    // on touch screen
    '[style.touchAction]': '"none"',
    // default to absolute here to accommodate likely use cases
    // consuming component can easily over ride with position input
    '[style.position]': 'position',
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

  @Output() resizeStart = new EventEmitter<TftResizeEvent>();
  @Output() resizeMove = new EventEmitter<TftResizeEvent>();
  @Output() resizeInertiaStart = new EventEmitter<TftResizeEvent>();
  @Output() resizeEnd = new EventEmitter<TftResizeEvent>();

  defaultConfig: Partial<Interact.OrBoolean<ResizableOptions>> = {
    edges: { left: true, right: true, bottom: true, top: true }
  };
  registryId: string;
  interactable: Interactable;

  private interactableSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private interactService: InteractService,
    @Optional() private draggable_dir?: DraggableDirective,
    @Optional() @SkipSelf() private dropzone_dir?: DropzoneDirective
  ) { }

  ngOnInit() {
    // we check for a dropzone, we use its id as the registry id if there is on
    // otherwise, we use DEFAULT_REGISTRY_ID as a registry id. This allows us to keep our interactable
    // drag state organized by dropzones.
    this.registryId = this.dropzone_dir && this.dropzone_dir.dropzoneId
      ? this.dropzone_dir.dropzoneId
      : DEFAULT_REGISTRY_ID;

    this.interactableId = this.draggable_dir && this.draggable_dir.interactableId
      ? this.draggable_dir.interactableId
      : this.interactService.addDraggableToRegistry(this.registryId, this.interactableId);

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
    if (changes.resizeConfig && this.interactable) {
      this.interactable.resizable(this.resizeConfig);
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
    const deltaX = event.deltaRect.left;
    const deltaY = event.deltaRect.top;
    const { width, height } = event.rect;
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
    return interact(nativeElement).resizable(resizeConfig)
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
    const { target } = event;
    const relatedTarget = this.draggable_dir?.dropzone_dir?.el.nativeElement

    const positionInDropTarget = target && relatedTarget
      ? this.interactService.calculatePositionInElement(relatedTarget, target as HTMLElement)
      : null;
    return {
      interactEvent: event,
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
}
