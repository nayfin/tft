import { Directive, ElementRef, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, Renderer2, Optional, HostBinding } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions, Interactable } from '@interactjs/types/index';
import { InteractService } from '../services/interact.service';
import { NgDropEvent, TftDragElement, TftDropEvent } from '../models';
import { AccountForScaleDirective } from './account-for-scale.directive';

export type PositionOption = 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky' | 'unset' | 'inherit' | 'initial' | 'revert'
@Directive({
  selector: '[tftDropzone]',
  host: {
    '[id]': 'dropzoneId'
  }
})
export class DropzoneDirective implements OnInit, OnChanges {

  @Input() dropzoneId: string;
  @Input() dropzoneConfig: DropzoneOptions = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() dropzoneData: any;

  @Input()
  @HostBinding('style.position') position: PositionOption = 'relative';
  // proxies to pass interact events through to consumer of directive
  @Output() dropActivate = new EventEmitter<TftDropEvent>();
  @Output() dragEnter = new EventEmitter<TftDropEvent>();
  @Output() dragLeave = new EventEmitter<TftDropEvent>();
  @Output() dragDrop = new EventEmitter<TftDropEvent>();

  dropzone: Interactable;

  get scale(): number {
    return this.account_for_scale_dir?.scale;
  }
  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private interactService: InteractService,
    @Optional() private account_for_scale_dir?: AccountForScaleDirective
  ) { }

  ngOnInit() {
    // connects
    this.dropzone = this.connectDropzoneEvents(this.el.nativeElement, this.dropzoneConfig);
    this.dropzoneId = this.interactService.addRegistryToSystem(this.dropzoneId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!changes.dropzoneConfig || !this.dropzone) return;
    // this.dropzone.unset();
    // this.dropzone = this.connectDropzoneEvents(this.el.nativeElement, this.dropzoneConfig)
    this.dropzone.dropzone(this.dropzoneConfig)
  }
  /**
  * Connects element to interacts dropzone events and returns a reference to the interactable
  * @param nativeElement the element to tie drop events to
  * @param dropzoneConfig the interact configuration to use when connecting
  */
  connectDropzoneEvents(nativeElement, dropzoneConfig: DropzoneOptions) {
    return interact(nativeElement).dropzone(dropzoneConfig)
      // TODO: investigate when this fires in different scenarios
      .on('dropactivate', (event: NgDropEvent) => {
        this.dropActivate.emit(this.mapDropzoneEvent(event));
      })
      .on('dragenter', (event: NgDropEvent) => {
        this.renderer.setProperty(event.relatedTarget, 'dropTarget', this)
        this.dragEnter.emit(this.mapDropzoneEvent(event));
      })
      .on('dragleave', (event: NgDropEvent) => {
        if ( event.relatedTarget.dropTarget === this) {
          this.renderer.setProperty(event.relatedTarget, 'dropTarget', null)
        }
        this.dragLeave.emit(this.mapDropzoneEvent(event));
      })
      .on('drop',  (event: NgDropEvent) => {
        this.dragDrop.emit(this.mapDropzoneEvent(event));
      });
  }
  /**
   * Maps the drop event emitted by interact to something a little easier to use
   * @param event the drop event emitted by interact, extended with extra fields we added to
   */
  mapDropzoneEvent(event: NgDropEvent): TftDropEvent {
    const zoneElement = event.target;
    const dragElement = event.relatedTarget?.dragRef?.previewRef as TftDragElement;
    const scale = this.scale;
    const positionInDropTarget = zoneElement && dragElement
    ? this.interactService.calculatePositionInElement(zoneElement, dragElement, scale)
    : null;
    return {
      interactEvent: event,
      dragRef: dragElement.dragRef,
      dragOrigin: dragElement.dragOrigin,
      dropTarget: event.relatedTarget.dropTarget,
      positionInDropTarget
    }
  }
}
