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
import { AutoScrollDirective } from './auto-scroll.directive';

interface ActiveEdges {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}
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

  private activeEdges: ActiveEdges = {left: false, right: false, top: false, bottom: false}
  private interactableSubscription: Subscription;
  private scrollEventsSubscription: Subscription;

  get scale(): number {
    return this.account_for_scale_dir?.scale || this.drag_root_dir?.account_for_scale_dir?.scale;
  }

  constructor(
    public el: ElementRef,
    @Inject(DOCUMENT) private _document: Document,
    private interactService: InteractService,
    private renderer: Renderer2,
    @Optional() private drag_root_dir?: DragRootDirective,
    @Optional() public account_for_scale_dir?: AccountForScaleDirective,
    @Optional() private draggable_dir?: DraggableDirective,
    @Optional() @SkipSelf() private dropzone_dir?: DropzoneDirective,
    @Optional() @SkipSelf() public auto_scroll_dir?: AutoScrollDirective


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
    const element: TftDragElement = this.el.nativeElement;
    const scale = this.scale;
    const {deltaRect} = event;
    const deltaX = deltaRect.left/scale;
    const deltaY = deltaRect.top/scale;
    // We get the width and height directly from the native element because
    // the event dimension can get out of sync when resizing with autoScroll
    const rect = element.getBoundingClientRect();
    const width = (rect.width + deltaRect.width)/scale;
    const height = (rect.height + deltaRect.height)/scale;

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
  initiateResizeEvents(resizeConfig: Partial<Interact.OrBoolean<ResizableOptions>>, nativeElement: TftDragElement) {
    // TODO: This should try and get interactable from tft_draggable if it exists
    const defaultResizeConfig = {
      ...resizeConfig,
      enabled: !this.resizeDisabled,
      ...(this.auto_scroll_dir && {
        autoScroll: {
          ...this.auto_scroll_dir.autoScrollConfig,
          container: this.auto_scroll_dir.el.nativeElement as HTMLElement
        }
      })
    };
    const interactable = this.draggable_dir?.interactable || interact(nativeElement);
    return interactable.resizable(defaultResizeConfig)
      .on('resizestart', (event: NgResizeEvent) => {
        this.activeEdges = event.edges as ActiveEdges;
        if (this.auto_scroll_dir) {
          this.subscribeToScrollEvents();
        }
        this.resizeStart.emit(this.mapResizeEvent(event))
      })
      .on('resizemove',  (event: NgResizeEvent) => {
        if (this.enableResizeDefault) {
          this.resizeListener(event)
        }
        const mappedEvent = this.mapResizeEvent(event);
        this.resizeMove.emit(mappedEvent)
      })
      .on('resizeinertiastart', (event: NgResizeEvent) => this.resizeInertiaStart.emit(this.mapResizeEvent(event)))
      .on('resizeend', (event: NgResizeEvent) => {
        if (this.auto_scroll_dir) {
          this.scrollEventsSubscription.unsubscribe();
        }
        this.activeEdges = {left: false, right: false, top: false, bottom: false}

        this.resizeEnd.emit(this.mapResizeEvent(event));
      });
  }

  mapResizeEvent(event: NgResizeEvent ): TftResizeEvent {
    const target  = this.el.nativeElement as TftDragElement;
    const relatedTarget = this.draggable_dir?.dropzone_dir?.el.nativeElement;
    const scale = this.scale;
    const positionInDropTarget = target && relatedTarget
      ? this.interactService.calculatePositionInElement(relatedTarget, target, scale)
      : null;
    return {
      interactEvent: event,
      resizeRef: this,
      dragRef: this.draggable_dir,
      dragOrigin: this.dropzone_dir,
      dropTarget: this.el.nativeElement.dropTarget,
      positionInDropTarget,
      size: {
        width: target.clientWidth / scale,
        height: target.clientHeight / scale
      }
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

  subscribeToScrollEvents() {
    this.scrollEventsSubscription = this.auto_scroll_dir.scrollDeltaObserver.subscribe(({scrollLeft, scrollTop}) => {
      const scale = this.scale;
      const target = this.el.nativeElement as HTMLElement;
      const {width: prevWidth, height: prevHeight} = target.getBoundingClientRect();

      const deltaHeight = scrollTop * (this.activeEdges.top ? -1 : this.activeEdges.bottom ? 1 : 0);
      const deltaWidth = scrollLeft * (this.activeEdges.left ? -1 : this.activeEdges.right ? 1 : 0);

      const height = (prevHeight + deltaHeight) / scale;
      const width = (prevWidth + deltaWidth) / scale;
      const deltaX = this.activeEdges.left ? (scrollLeft / scale) : 0;
      const deltaY = this.activeEdges.top ? (scrollTop / scale) : 0;
      this.interactService.updateSize(
        this.interactableId,
        this.registryId,
        {deltaX, deltaY, width, height},
        this.el.nativeElement as HTMLElement
      );
    });
  }
}
