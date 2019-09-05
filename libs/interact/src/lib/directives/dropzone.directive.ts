import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions } from '@interactjs/types/types';

@Directive({
  selector: '[tftDropzone]'
})
export class DropzoneDirective implements OnInit {
  
  DEFAULT_CONFIG: DropzoneOptions = {
    overlap: 0.5,
    ondropactivate: (event) => {
      // add active dropzone feedback
      event.target.classList.add('drop-active')
    },
    ondragenter: (event) => {
      const draggableElement = event.relatedTarget
      const dropzoneElement = event.target
      console.log({dragenter: event});
      // feedback the possibility of a drop
      dropzoneElement.classList.add('drop-target')
      draggableElement.classList.add('can-drop')
    },
    ondragleave: (event) => {
      // remove the drop feedback style
      event.target.classList.remove('drop-target')
      event.relatedTarget.classList.remove('can-drop')
      // event.relatedTarget.textContent = 'Dragged out'
    },
    ondrop: (event) => {
      console.log({dropEvent: event});
      // event.relatedTarget.textContent = 'Dropped'
    },
    ondropdeactivate: function (event) {
      // remove active dropzone feedback
      event.target.classList.remove('drop-active')
      event.target.classList.remove('drop-target')
    }
  }

  @Input() dropzoneConfig: DropzoneOptions;
  @Output() dropActivate = new EventEmitter();  
  constructor(
    private el: ElementRef,
  ) { }
  
  ngOnInit() {
    interact(this.el.nativeElement).dropzone({ ...this.DEFAULT_CONFIG, ...this.dropzoneConfig})
  }
}
