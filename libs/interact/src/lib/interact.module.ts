import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './directives/draggable.directive';
import { ResizableDirective } from './directives/resizable.directive';
import { DropzoneDirective } from './directives/dropzone.directive';
import { ArrayOfNPipe } from './pipes/array-of-n.pipe';
import { DragPreviewDirective } from './directives/drag-preview.directive';

const EXPORTS = [
  DraggableDirective,
  ResizableDirective,
  DropzoneDirective,
  ArrayOfNPipe,
  DragPreviewDirective
];


@NgModule({
  imports: [CommonModule],
  declarations: [
    ...EXPORTS,
  ],
  exports: [
    ...EXPORTS
  ]
})
export class InteractModule {}
