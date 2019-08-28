import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import interact from 'interactjs';
import { DropzoneOptions } from '@interactjs/types/types';

@Directive({
  selector: '[tftDropzone]'
})
export class DropzoneDirective implements OnInit {
  
  DEFAULT_CONFIG: DropzoneOptions = {
    overlap: 0.5
  }

  @Input() dropzoneConfig: DropzoneOptions;
  
  constructor(
    private el: ElementRef,
  ) { }
  
  ngOnInit() {
    interact(this.el.nativeElement).dropzone({ ...this.DEFAULT_CONFIG, ...this.dropzoneConfig})
  }
}
