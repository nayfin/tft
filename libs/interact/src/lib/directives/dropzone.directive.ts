import { Directive, ElementRef, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, Renderer2 } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions, Interactable } from '@interactjs/types/index';
import { InteractService } from '../services/interact.service';
import { NgDropEvent, TftDragElement, TftDropEvent } from '../models';
@Directive({
  selector: '[tftDropzone]',
  host: {
    '[id]': 'dropzoneId',
  }
})
export class DropzoneDirective implements OnInit, OnChanges {

  @Input() dropzoneId: string;
  @Input() dropzoneConfig: DropzoneOptions = {};
  // tslint:disable-next-line: no-input-rename
  @Input() dropzoneData: any;
  // proxies to pass interact events through to consumer of directive
  @Output() dropActivate = new EventEmitter();
  @Output() dragEnter = new EventEmitter();
  @Output() dragLeave = new EventEmitter();
  @Output() dragDrop = new EventEmitter();

  dropzone: Interactable;
  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private interactService: InteractService
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
        // console.log({dropactivate: event})
        this.dropActivate.emit(this.mapDropzoneEvent(event));
      })
      .on('dragenter', (event: NgDropEvent) => {
        this.renderer.setProperty(event.relatedTarget, 'dropTarget', this)
        this.renderer.setProperty(event.target, 'dropTarget', this)
        this.dragEnter.emit(this.mapDropzoneEvent(event));
      })
      .on('dragleave', (event: NgDropEvent) => {
        if ( event.relatedTarget.dropTarget === this) {
          this.renderer.setProperty(event.relatedTarget, 'dropTarget', null)
          this.renderer.setProperty(event.target, 'dropTarget', this)
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
    const zoneElement = event.draggable.target.dropTarget?.el?.nativeElement as HTMLElement;
    const dragElement = event.relatedTarget as TftDragElement;
    const positionInDropTarget = zoneElement && dragElement
    ? this.interactService.calculatePositionInDropzone(zoneElement, dragElement)
    : null;
    return {
      interactEvent: event,
      dragRef: dragElement.dragRef,
      dragOrigin: dragElement.dragOrigin,
      dropTarget: event.draggable.target.dropTarget,
      positionInDropTarget
    }
  }
}
