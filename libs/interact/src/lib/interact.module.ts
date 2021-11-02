import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayOfNPipe } from './pipes/array-of-n.pipe';
import { GesturableDirective, DraggableDirective, ResizableDirective, DropzoneDirective, DragPreviewDirective } from './directives';

const EXPORTS = [
  DraggableDirective,
  ResizableDirective,
  DropzoneDirective,
  GesturableDirective,
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
