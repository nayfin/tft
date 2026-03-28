import { Directive, ElementRef, OnInit, output, input, inject, effect, signal, computed, Renderer2 } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions, Interactable } from '@interactjs/types/index';
import { InteractService } from '../services/interact.service';
import { NgDropEvent, TftDragElement, TftDropEvent } from '../models';
import { AccountForScaleDirective } from './account-for-scale.directive';

export type PositionOption = 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky' | 'unset' | 'inherit' | 'initial' | 'revert';

@Directive({
  selector: '[tftDropzone]',
  standalone: true,
  host: {
    '[id]': '_registeredId()',
    '[style.position]': 'position()',
  },
})
export class DropzoneDirective implements OnInit {
  el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private interactService = inject(InteractService);
  private account_for_scale_dir = inject(AccountForScaleDirective, { optional: true });

  dropzoneId = input<string>();
  dropzoneConfig = input<DropzoneOptions>({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dropzoneData = input<any>();
  position = input<PositionOption>('relative');

  dropActivate = output<TftDropEvent>();
  dragEnter = output<TftDropEvent>();
  dragLeave = output<TftDropEvent>();
  dragDrop = output<TftDropEvent>();

  dropzone: Interactable;
  /** The actual registered ID — may differ from the dropzoneId input if none was provided. Drives [id] host binding. */
  _registeredId = signal<string>(null);

  scale = computed(() => this.account_for_scale_dir?.scale());

  ngOnInit() {
    this.dropzone = this.connectDropzoneEvents(this.el.nativeElement, this.dropzoneConfig());
    this._registeredId.set(this.interactService.addRegistryToSystem(this.dropzoneId()));
  }

  constructor() {
    effect(() => {
      const config = this.dropzoneConfig();
      if (!this.dropzone) return;
      this.dropzone.dropzone(config);
    });
  }

  /**
   * Connects element to interact's dropzone events and returns a reference to the interactable
   */
  connectDropzoneEvents(nativeElement, dropzoneConfig: DropzoneOptions) {
    return interact(nativeElement).dropzone(dropzoneConfig)
      .on('dropactivate', (event: NgDropEvent) => {
        this.dropActivate.emit(this.mapDropzoneEvent(event));
      })
      .on('dragenter', (event: NgDropEvent) => {
        this.renderer.setProperty(event.relatedTarget, 'dropTarget', this);
        this.dragEnter.emit(this.mapDropzoneEvent(event));
      })
      .on('dragleave', (event: NgDropEvent) => {
        if (event.relatedTarget.dropTarget === this) {
          this.renderer.setProperty(event.relatedTarget, 'dropTarget', null);
        }
        this.dragLeave.emit(this.mapDropzoneEvent(event));
      })
      .on('drop', (event: NgDropEvent) => {
        this.dragDrop.emit(this.mapDropzoneEvent(event));
      });
  }

  /**
   * Maps the drop event emitted by interact to something a little easier to use
   */
  mapDropzoneEvent(event: NgDropEvent): TftDropEvent {
    const zoneElement = event.target;
    const dragElement = event.relatedTarget?.dragRef?.previewRef as TftDragElement;
    const scale = this.scale();
    const positionInDropTarget = zoneElement && dragElement
      ? this.interactService.calculatePositionInElement(zoneElement, dragElement, scale)
      : null;
    return {
      interactEvent: event,
      dragRef: dragElement.dragRef,
      dragOrigin: dragElement.dragOrigin,
      dropTarget: event.relatedTarget.dropTarget,
      positionInDropTarget,
    };
  }
}
