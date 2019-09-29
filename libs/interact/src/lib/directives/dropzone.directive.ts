import { Directive, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions, InteractEvent } from '@interactjs/types/types';
import { InteractService } from '../services/interact.service';

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
    }
  }

  @Input() dropzoneConfig: DropzoneOptions;

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
    console.log({registry: this.interactService.dragRegistrySystem})
  }
}
