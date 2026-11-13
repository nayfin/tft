import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[crisprFileDropzone]',
  standalone: true,
})
export class FileDropzoneDirective {

  readonly fileDrop = output<FileList>();

  readonly crisprFileDropzone = input(true);

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent) {
    if(this.crisprFileDropzone()) {
      $event.preventDefault();
      this.fileDrop.emit($event.dataTransfer.files);
    }
  }

  // Prevents DOM from trying to open file in browser
  @HostListener('dragover', ['$event'])
  onDragOver($event: DragEvent) {
    if(this.crisprFileDropzone()) {
      $event.preventDefault();
    }
  }
}
