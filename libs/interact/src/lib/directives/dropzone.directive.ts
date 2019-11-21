import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions } from '@interactjs/types/types';
import { InteractService } from '../services/interact.service';
import { NgDropEvent, TftDropEvent } from '../models';
import Interactable from '@interactjs/core/Interactable';
@Directive({
  selector: '[tftDropzone]',
  host: {    
    '[id]': 'dropzoneId',
  }
})
export class DropzoneDirective implements OnInit {

  @Input() dropzoneId: string;
  @Input() dropzoneConfig: DropzoneOptions;
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
    private interactService: InteractService
  ) { }
  
  ngOnInit() {
    // connects 
    this.dropzone =this.connectDropzoneEvents(this.el.nativeElement, this.dropzoneConfig);
    // this is weird... addRegistryToSystem returns the dropzoneId if one is passed in. It creates one 
    // if it hasn't been defined.
    // TODO: make this more gooder, and better too
    this.dropzoneId = this.interactService.addRegistryToSystem(this.dropzoneId);
  }
  /**
  * Connects element to interacts dropzone events and returns a reference to the interactable
  * @param nativeElement the element to tie drop events to
  * @param dropzoneConfig the interact configuration to use when connecting 
  */
  connectDropzoneEvents(nativeElement, dropzoneConfig: DropzoneOptions) {
    return interact(nativeElement).dropzone(dropzoneConfig)
      .on('dropactivate', (event: NgDropEvent) => this.dropActivate.emit(this.mapDropzoneEvent(event))) 
      .on('dragenter', (event: NgDropEvent) => {
        event.draggable.target.dropTarget = this;
        this.dragEnter.emit(this.mapDropzoneEvent(event));
      }) 
      .on('dragleave', (event: NgDropEvent) => {
        const target = event.draggable.target;
        if ( target.dropTarget === this) {
          target.dropTarget = null;
        }
        this.dragLeave.emit(this.mapDropzoneEvent(event));
      }) 
      .on('drop',  (event: NgDropEvent) => this.dragDrop.emit(this.mapDropzoneEvent(event)));
  }
  /**
   * Maps the drop event emitted by interact to something a little easier to use
   * @param event the drop event emitted by interact, extended with extra fields we added to 
   */
  mapDropzoneEvent(event: NgDropEvent): TftDropEvent {
    const positionInDropTarget = this.interactService.calculatePositionInDropzone(event.target, event.draggable.target);
    const dragRef = event.draggable.target.dragRef;
    return {
      interactEvent: event,
      dragRef,
      dragOrigin: dragRef.dropzone_dir,
      dropTarget: event.draggable.target.dropTarget,
      positionInDropTarget
    }
  }
}
