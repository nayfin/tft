import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions } from '@interactjs/types/types';
import { InteractService } from '../services/interact.service';
import { NgDropEvent } from '../models';
@Directive({
  selector: '[tftDropzone]'
})
export class DropzoneDirective implements OnInit {
  
  DEFAULT_CONFIG: DropzoneOptions = {
    overlap: 0.5,
    ondropactivate: (event: NgDropEvent) => {
      // add active dropzone feedback
      this.dropActivate.emit(event);
    },
    ondragenter: (event: NgDropEvent) => {
      this.dragEnter.emit(event);
    },
    ondragleave: (event: NgDropEvent) => {
      this.dragLeave.emit(event);
    },
    ondrop: (event: NgDropEvent) => {
      const dropPoint = this.calculateDropPoint(event);
      const emitItems = {
        event: event,
        // TODO: getting set and getting data from the target element is not ideal way to transfer data
        // find an Angulary way to do this
        dragRef: event.draggable.target.dragRef,
        previousContainer: event.draggable.target.dragRef.dropzone_dir,
        dropPoint
      }
      this.dragDrop.emit(emitItems);
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
    private el: ElementRef,
    private interactService: InteractService
  ) { }
  
  ngOnInit() {
    this.interactService.checkForOverridesInConfig(this.dropzoneConfig, ['ondropactivate', 'ondragenter', 'ondragleave','ondrop'] );
    interact(this.el.nativeElement).dropzone({ ...this.DEFAULT_CONFIG, ...this.dropzoneConfig});
    this.dropzoneId = this.interactService.addRegistryToSystem();
  }

  calculateDropPoint(event: NgDropEvent) {
    const zoneRect = event.target.getBoundingClientRect(),
          draggableRect = event.draggable.target.getBoundingClientRect();
    return {
      x: draggableRect.left - zoneRect.left,
      y: draggableRect.top - zoneRect.top
    } 
  }
}
