import { Directive, ElementRef, input, output, OnInit, OnDestroy, effect, computed, Renderer2, ContentChild, ViewContainerRef, AfterViewInit, DOCUMENT, inject } from '@angular/core';

import interact from 'interactjs';
import { InteractService } from '../services/interact.service';
import { DraggableOptions, Interactable } from '@interactjs/types/index';
import { Subscription, Observable } from 'rxjs';
import { DropzoneDirective } from './dropzone.directive';
import { NgDragEvent, TftDragEvent, DEFAULT_REGISTRY_ID, TftCoords, TftDragElement } from '../models';
import { DragPreviewDirective } from './drag-preview.directive';
import { getRootNode } from '../utils';
import { DragRootDirective } from './drag-root.directive';
import { AccountForScaleDirective } from './account-for-scale.directive';
import { AutoScrollDirective } from './auto-scroll.directive';

/** @dynamic */
@Directive({
  selector: '[tftDraggable]',
  standalone: true,
  host: {
    '[style.user-select]': 'dragDisabled() ? "auto" : "none"',
    '[style.touch-action]': 'dragDisabled() ? "auto" : "none"',
    '[style.position]': '"absolute"',
    '[id]': 'interactableId',
  },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DraggableDirective<D = any> implements OnInit, OnDestroy, AfterViewInit {
  el = inject(ElementRef);
  private interactService = inject(InteractService);
  private renderer = inject(Renderer2);
  private _viewContainerRef = inject(ViewContainerRef);
  private _document = inject<Document>(DOCUMENT);
  account_for_scale_dir? = inject(AccountForScaleDirective, { optional: true });
  dropzone_dir? = inject(DropzoneDirective, { optional: true, skipSelf: true });
  drag_root_dir? = inject(DragRootDirective, { optional: true, skipSelf: true });
  auto_scroll_dir? = inject(AutoScrollDirective, { optional: true, skipSelf: true });

  x = input<number>();
  y = input<number>();
  /** zIndex while dragging */
  dragZIndex = input(10000);
  /** zIndex while at rest */
  zIndex = input<number>();
  interactableId: string;
  dragData = input<D>();
  enableDragDefault = input(true);
  /**
   * @deprecated replaced by 'dragDisabled' property, please migrate before v13
   */
  disabled = input(false);
  dragDisabled = input(false);
  dragConfig = input<Partial<Interact.OrBoolean<DraggableOptions>>>();
  showPlaceholder = input(false);

  /**
   * The element we want to prepend the drag element to.
   * Use `tftDragRoot` directive on a parent element to set custom root element
   *  @default document.body
   */
  dragRoot = input<DragRootDirective>();

  private dragRootEl: HTMLElement;

  dragStart = output<TftDragEvent>();
  dragMove = output<TftDragEvent>();
  dragInertiaStart = output<TftDragEvent>();
  dragEnd = output<TftDragEvent>();

  @ContentChild(DragPreviewDirective) _previewTemplate: DragPreviewDirective;
  interactableState: Observable<TftCoords>;
  interactable: Interactable;
  private registryId: string;
  private interactableSubscription: Subscription;
  private scrollEventsSubscription: Subscription;

  previewRef: TftDragElement;

  scale = computed(() =>
    this.account_for_scale_dir?.scale() || this.drag_root_dir?.account_for_scale_dir?.scale() || this.dragRoot()?.account_for_scale_dir?.scale() || 1
  );

  constructor() {
    effect(() => {
      this.alignPositionWithInputs(this.x(), this.y());
    });

    effect(() => {
      const disabled = this.disabled();
      this.dragConfig(); this.dragDisabled();
      if (disabled) {
        console.warn(`It looks like your using the 'disabled' input on a tftDraggable directive, it has been deprecated and is replaced with 'dragDisabled', please migrate by v13`);
      }
      if (!this.interactable) return;
      this.setDragConfig();
    });
  }

  ngOnInit() {
    this.interactable = this.initiateDragEvents(this.dragConfig(), this.el.nativeElement);
    this.dragRootEl = (this.dragRoot()?.el?.nativeElement || this.drag_root_dir?.el?.nativeElement) as HTMLElement || this._document.body;
    this.registryId = this.dropzone_dir?._registeredId() || DEFAULT_REGISTRY_ID;
    this.interactableId = this.interactService.addDraggableToRegistry(this.registryId, this.interactableId);
    this.alignPositionWithInputs(this.x(), this.y());
    this.interactableState = this.interactService
      .getInteractableState(this.interactableId, this.registryId);
    this.interactableSubscription = this.interactableState.subscribe();
    this.setDragConfig();
  }

  setDragConfig() {
    const enabled = !(this.disabled() || this.dragDisabled());
    const dragConfig = { ...this.dragConfig(), enabled };
    this.interactable.draggable(dragConfig);
  }

  ngAfterViewInit() {
    this.addDragPropertiesToElement(this.el.nativeElement);
    if (!this.dropzone_dir) {
      this.previewRef = this.el.nativeElement;
    }
  }

  ngOnDestroy() {
    this.interactableSubscription.unsubscribe();
    this.interactService.destroyInteractable(this.interactableId, this.registryId);
  }

  dragMoveListener(event: NgDragEvent, element: Interact.Element) {
    const { dx, dy } = event;
    const scale = this.scale();
    const deltaX = scale ? dx / scale : dx;
    const deltaY = scale ? dy / scale : dy;

    this.interactService.updateDeltas(
      this.interactableId,
      this.registryId,
      { deltaX, deltaY },
      element
    );
  }

  setDragStyles(dragElement: HTMLElement) {
    this.renderer.setStyle(dragElement, 'touch-action', 'none');
    this.renderer.setStyle(dragElement, 'z-index', this.dragZIndex());
    this.renderer.setStyle(dragElement, 'position', 'absolute');
    // Prevents highlighting text if dragging over, which will interrupt the next drag action
    this.renderer.setStyle(dragElement, 'user-select', 'none');
  }

  addDragPropertiesToElement(nativeElement: TftDragElement) {
    this.renderer.setProperty(nativeElement, 'dropTarget', this.dropzone_dir || null);
    this.renderer.setProperty(nativeElement, 'dragOrigin', this.dropzone_dir || null);
    this.renderer.setProperty(nativeElement, 'dragRef', this);
  }

  mapDragEvent(event: NgDragEvent): TftDragEvent {
    const { target, dropzone } = event;
    const dropzoneElement = dropzone?.target || target.dropTarget?.el.nativeElement;
    const scale = this.scale();
    const positionInDropTarget = target && dropzoneElement
      ? this.interactService.calculatePositionInElement(dropzoneElement, this.previewRef, scale)
      : null;
    return {
      interactEvent: event,
      dragRef: this,
      dragOrigin: target.dragOrigin,
      dropTarget: target.dropTarget,
      positionInDropTarget,
    };
  }

  setPosition(x: number, y: number) {
    this.interactService.updatePosition(
      this.interactableId,
      this.registryId,
      { x, y },
      this.el.nativeElement
    );
  }

  alignPositionWithInputs(x: number, y: number) {
    if (!this.isValidPosition(x, y)) return;
    this.interactService.updatePosition(
      this.interactableId,
      this.registryId,
      { x, y },
      this.el.nativeElement
    );
  }

  isValidPosition(x: number, y: number) {
    return this.isNumeric(x) && this.isNumeric(y);
  }

  isNumeric(num: number) {
    return typeof num === 'number' && !isNaN(num);
  }

  initiateDragEvents(dragConfig: Partial<Interact.OrBoolean<DraggableOptions>>, nativeElement: HTMLElement) {
    const defaultDragConfig = {
      ...dragConfig,
      enabled: !(this.disabled() || this.dragDisabled()),
      ...(this.auto_scroll_dir && {
        autoScroll: {
          ...this.auto_scroll_dir.autoScrollConfig(),
          container: this.auto_scroll_dir.el.nativeElement as HTMLElement,
        },
      }),
    };
    return interact(nativeElement).draggable(defaultDragConfig)
      .on('dragstart', (event: NgDragEvent) => {
        const interaction = event.interaction;
        if (this.enableDragDefault() && interaction.pointerIsDown) {
          if (this._previewTemplate) {
            const viewRef = this._viewContainerRef.createEmbeddedView(this._previewTemplate.templateRef);
            this.previewRef = getRootNode(viewRef, this._document);
          } else {
            this.previewRef = cloneElement(this.el.nativeElement);
          }
          this.addDragPropertiesToElement(this.previewRef);
          this.setDragStyles(this.previewRef);

          this.dragRootEl.prepend(this.previewRef);
          const scale = this.account_for_scale_dir?.scale() || this.dragRoot()?.account_for_scale_dir?.scale() || 1;
          const { x, y } = this.interactService.calculatePositionInElement(this.dragRootEl, nativeElement, scale);
          this.interactService.updatePosition(this.interactableId, this.registryId, { x, y }, this.previewRef);
          if (!this.showPlaceholder()) {
            this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
          }
        }
        if (this.auto_scroll_dir) {
          this.subscribeToScrollEvents();
        }
        this.dragStart.emit(this.mapDragEvent(event));
      })
      .on('dragmove', (event: NgDragEvent) => {
        if (this.enableDragDefault()) {
          const dragElement = this.dropzone_dir && this.previewRef || nativeElement;
          this.dragMoveListener(event, dragElement);
        }
        this.dragMove.emit(this.mapDragEvent(event));
      })
      .on('draginertiastart', (event: NgDragEvent) => {
        this.dragInertiaStart.emit(this.mapDragEvent(event));
      })
      .on('dragend', (event: NgDragEvent) => {
        const mappedEvent = this.mapDragEvent(event);
        if (!!this.dropzone_dir && this.dropzone_dir === event.target.dropTarget) {
          const { x, y } = mappedEvent.positionInDropTarget;
          this.setPosition(x, y);
        }
        this.renderer.setStyle(this.el.nativeElement, 'display', '');
        this.dragEnd.emit(mappedEvent);
        if (this.auto_scroll_dir) {
          this.scrollEventsSubscription.unsubscribe();
        }
        if (this.el.nativeElement !== this.previewRef) {
          setTimeout(() => {
            this.dragRootEl.removeChild(this.previewRef);
          });
        }
      });
  }

  subscribeToScrollEvents() {
    this.scrollEventsSubscription = this.auto_scroll_dir.scrollDeltaObserver.subscribe(({ scrollLeft, scrollTop }) => {
      const deltaX = this.scale() ? scrollLeft / this.scale() : scrollLeft;
      const deltaY = this.scale() ? scrollTop / this.scale() : scrollTop;

      this.interactService.updateDeltas(
        this.interactableId,
        this.registryId,
        { deltaX, deltaY },
        this.previewRef
      );
    });
  }
}

/**
 * Component utils
 */
function cloneElement(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute('id');
  return clone;
}
