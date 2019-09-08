import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions, InteractEvent } from '@interactjs/types/types';

@Directive({
  selector: '[tftDropzone]'
})
export class DropzoneDirective implements OnInit {
  
  DEFAULT_CONFIG: DropzoneOptions = {
    overlap: 0.5,
    ondropactivate: (event: InteractEvent) => {
      // add active dropzone feedback
      this.dropActivate.emit(event);
    },
    ondragenter: (event: InteractEvent) => {
      this.dragEnter.emit(event);
    },
    ondragleave: (event: InteractEvent) => {
      this.dragLeave.emit(event);
    },
    ondrop: (event: InteractEvent) => {
      this.dragDrop.emit(event);
    },
    ondropdeactivate: function (event: InteractEvent) {
      this.dropActivate.emit(event);
    }
  }

  @Input() dropzoneConfig: DropzoneOptions;

  @Output() dropActivate = new EventEmitter();  
  @Output() dropDeactivate = new EventEmitter();  
  @Output() dragEnter = new EventEmitter();  
  @Output() dragLeave = new EventEmitter(); 
  @Output() dragDrop = new EventEmitter();  

  constructor(
    private el: ElementRef,
  ) { }
  
  ngOnInit() {
    interact(this.el.nativeElement).dropzone({ ...this.DEFAULT_CONFIG, ...this.dropzoneConfig});
  }
}
