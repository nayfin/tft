import { Directive, OnInit, OnDestroy, ElementRef, output, input, effect, computed, Renderer2, DOCUMENT, inject } from '@angular/core';

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
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    // prevents touch events from colliding with mouse events on touch screen
    '[style.touch-action]': 'resizeDisabled() ? "auto" : "none"',
    // default to absolute here to accommodate likely use cases
    '[style.position]': 'position()',
    // follows interactjs suggested practices
    '[style.box-sizing]': '"border-box"',
  },
})
export class ResizableDirective implements OnInit, OnDestroy {
  el = inject(ElementRef);
  private _document = inject<Document>(DOCUMENT);
  private interactService = inject(InteractService);
  private renderer = inject(Renderer2);
  private drag_root_dir = inject(DragRootDirective, { optional: true });
  account_for_scale_dir? = inject(AccountForScaleDirective, { optional: true });
  private draggable_dir = inject(DraggableDirective, { optional: true });
  private dropzone_dir = inject(DropzoneDirective, { optional: true, skipSelf: true });
  auto_scroll_dir? = inject(AutoScrollDirective, { optional: true, skipSelf: true });

  enableResizeDefault = input(true);
  position = input('absolute');
  resizeConfig = input<Partial<Interact.OrBoolean<ResizableOptions>>>();
  interactableId = input<string>();

  width = input<number>();
  height = input<number>();
  resizeDisabled = input(false);

  resizeStart = output<TftResizeEvent>();
  resizeMove = output<TftResizeEvent>();
  resizeInertiaStart = output<TftResizeEvent>();
  resizeEnd = output<TftResizeEvent>();

  defaultConfig: Partial<Interact.OrBoolean<ResizableOptions>> = {
    edges: { left: true, right: true, bottom: true, top: true },
  };
  registryId: string;
  interactable: Interactable;
  dragRootEl: HTMLElement;
  _interactableId: string;

  private activeEdges: ActiveEdges = { left: false, right: false, top: false, bottom: false };
  private interactableSubscription: Subscription;
  private scrollEventsSubscription: Subscription;

  scale = computed(() =>
    this.account_for_scale_dir?.scale() || this.drag_root_dir?.account_for_scale_dir?.scale()
  );

  constructor() {
    this.dragRootEl = (this.drag_root_dir?.el?.nativeElement as HTMLElement) || this._document.body;

    effect(() => {
      this.resizeConfig(); this.resizeDisabled();
      if (!this.interactable) return;
      this.interactable.resizable({ ...this.resizeConfig(), enabled: !this.resizeDisabled() });
    });

    effect(() => {
      this.alignDimensionsWithInputs(this.width(), this.height());
    });
  }

  ngOnInit() {
    this.addResizePropertiesToElement(this.el.nativeElement);

    this.registryId = this.dropzone_dir?._registeredId() || DEFAULT_REGISTRY_ID;
    this._interactableId = this.draggable_dir?.interactableId || this.interactService.addDraggableToRegistry(this.registryId, this.interactableId());

    this.interactable = this.initiateResizeEvents(
      { ...this.defaultConfig, ...this.resizeConfig() },
      this.el.nativeElement
    );

    this.alignDimensionsWithInputs(this.width(), this.height());

    this.interactableSubscription = this.interactService
      .getInteractableState(this._interactableId, this.registryId)
      .subscribe();
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this._interactableId, this.registryId);
  }

  resizeListener(event: ResizeEvent) {
    const element: TftDragElement = this.el.nativeElement;
    const scale = this.scale();
    const { deltaRect } = event;
    const deltaX = deltaRect.left / scale;
    const deltaY = deltaRect.top / scale;
    const rect = element.getBoundingClientRect();
    const width = (rect.width + deltaRect.width) / scale;
    const height = (rect.height + deltaRect.height) / scale;

    this.interactService.updateSize(
      this._interactableId,
      this.registryId,
      { deltaX, deltaY, width, height },
      this.el.nativeElement
    );
  }

  initiateResizeEvents(resizeConfig: Partial<Interact.OrBoolean<ResizableOptions>>, nativeElement: TftDragElement) {
    const defaultResizeConfig = {
      ...resizeConfig,
      enabled: !this.resizeDisabled(),
      ...(this.auto_scroll_dir && {
        autoScroll: {
          ...this.auto_scroll_dir.autoScrollConfig(),
          container: this.auto_scroll_dir.el.nativeElement as HTMLElement,
        },
      }),
    };
    const interactable = this.draggable_dir?.interactable || interact(nativeElement);
    return interactable.resizable(defaultResizeConfig)
      .on('resizestart', (event: NgResizeEvent) => {
        this.activeEdges = event.edges as ActiveEdges;
        if (this.auto_scroll_dir) {
          this.subscribeToScrollEvents();
        }
        this.resizeStart.emit(this.mapResizeEvent(event));
      })
      .on('resizemove', (event: NgResizeEvent) => {
        if (this.enableResizeDefault()) {
          this.resizeListener(event);
        }
        this.resizeMove.emit(this.mapResizeEvent(event));
      })
      .on('resizeinertiastart', (event: NgResizeEvent) => this.resizeInertiaStart.emit(this.mapResizeEvent(event)))
      .on('resizeend', (event: NgResizeEvent) => {
        if (this.auto_scroll_dir) {
          this.scrollEventsSubscription.unsubscribe();
        }
        this.activeEdges = { left: false, right: false, top: false, bottom: false };
        this.resizeEnd.emit(this.mapResizeEvent(event));
      });
  }

  mapResizeEvent(event: NgResizeEvent): TftResizeEvent {
    const target = this.el.nativeElement as TftDragElement;
    const relatedTarget = this.draggable_dir?.dropzone_dir?.el.nativeElement;
    const scale = this.scale();
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
        height: target.clientHeight / scale,
      },
    };
  }

  alignDimensionsWithInputs(width: number, height: number) {
    this.interactService.updateSize(
      this._interactableId,
      this.registryId,
      { deltaX: 0, deltaY: 0, width, height },
      this.el.nativeElement
    );
  }

  addResizePropertiesToElement(nativeElement: TftDragElement) {
    this.renderer.setProperty(nativeElement, 'resizeRef', this);
  }

  subscribeToScrollEvents() {
    this.scrollEventsSubscription = this.auto_scroll_dir.scrollDeltaObserver.subscribe(({ scrollLeft, scrollTop }) => {
      const scale = this.scale();
      const target = this.el.nativeElement as HTMLElement;
      const { width: prevWidth, height: prevHeight } = target.getBoundingClientRect();

      const deltaHeight = scrollTop * (this.activeEdges.top ? -1 : this.activeEdges.bottom ? 1 : 0);
      const deltaWidth = scrollLeft * (this.activeEdges.left ? -1 : this.activeEdges.right ? 1 : 0);

      const height = (prevHeight + deltaHeight) / scale;
      const width = (prevWidth + deltaWidth) / scale;
      const deltaX = this.activeEdges.left ? (scrollLeft / scale) : 0;
      const deltaY = this.activeEdges.top ? (scrollTop / scale) : 0;
      this.interactService.updateSize(
        this._interactableId,
        this.registryId,
        { deltaX, deltaY, width, height },
        this.el.nativeElement as HTMLElement
      );
    });
  }
}
