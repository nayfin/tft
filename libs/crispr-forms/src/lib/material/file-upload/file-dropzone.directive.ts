import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[crisprFileDropzone]',
  standalone: true,
})
export class FileDropzoneDirective {

  @Output() fileDrop =  new EventEmitter<FileList>();

  @Input() crisprFileDropzone = true;

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    if(this.crisprFileDropzone) {
      $event.preventDefault();
      this.fileDrop.emit($event.dataTransfer.files);
    }
  }

  // Prevents DOM from trying to open file in browser
  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    if(this.crisprFileDropzone) {
      $event.preventDefault();
    }
  }
}
