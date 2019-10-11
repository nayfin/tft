import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions } from '@interactjs/types/types';
import { InteractService } from '../services/interact.service';
import { NgDropEvent, TftDropEvent } from '../models';
@Directive({
  selector: '[tftDropzone]'
})
export class DropzoneDirective implements OnInit {
  
  DEFAULT_CONFIG: DropzoneOptions = {
    overlap: 0.5,
    ondropactivate: (event: NgDropEvent) => {
      // add active dropzone feedback
      this.dropActivate.emit(this.mapDropzoneEvent(event));
    },
    ondragenter: (event: NgDropEvent) => {
      event.draggable.target.dropTarget = this;
      this.dragEnter.emit(this.mapDropzoneEvent(event));
    },
    ondragleave: (event: NgDropEvent) => {
      const target = event.draggable.target;
      if ( target.dropTarget === this) {
        target.dropTarget = null;
      }
      this.dragLeave.emit(this.mapDropzoneEvent(event));
    },
    ondrop: (event: NgDropEvent) => {
      this.dragDrop.emit(this.mapDropzoneEvent(event));
    }
  }

  @Input() dropzoneConfig: DropzoneOptions;
  // tslint:disable-next-line: no-input-rename
  @Input() dropzoneData: any[];

  @Output() dropActivate = new EventEmitter();  
  @Output() dragEnter = new EventEmitter();  
  @Output() dragLeave = new EventEmitter(); 
  @Output() dragDrop = new EventEmitter();  

  dropzoneId: string;

  constructor(
    public el: ElementRef,
    private interactService: InteractService
  ) { }
  
  ngOnInit() {
    this.interactService.checkForOverridesInConfig(this.dropzoneConfig, ['ondropactivate', 'ondragenter', 'ondragleave','ondrop'] );
    interact(this.el.nativeElement).dropzone({ ...this.DEFAULT_CONFIG, ...this.dropzoneConfig});
    this.dropzoneId = this.interactService.addRegistryToSystem();
  }

  mapDropzoneEvent(event: NgDropEvent): TftDropEvent {

    const positionInDropzone = this.interactService.calculatePositionInDropzone(event.target, event.draggable.target);
    const dragRef = event.draggable.target.dragRef;
    return {
      event: event,
      // TODO: getting set and getting data from the target element is not ideal way to transfer data
      // find an Angulary way to do this
      dragRef,
      dragOrigin: dragRef.dropzone_dir,
      dropTarget: event.draggable.target.dropTarget,
      positionInDropzone
    }
  }


}
