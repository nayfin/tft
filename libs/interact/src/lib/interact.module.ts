import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayOfNPipe } from './pipes/array-of-n.pipe';
import { ApplyScaleDirective, DraggableDirective, DragRootDirective, AccountForScaleDirective, GesturableDirective, ResizableDirective, DropzoneDirective, DragPreviewDirective } from './directives';

const EXPORTS = [
  DraggableDirective,
  ResizableDirective,
  DropzoneDirective,
  GesturableDirective,
  DragRootDirective,
  AccountForScaleDirective,
  ApplyScaleDirective,
  DragPreviewDirective,
  ArrayOfNPipe,
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
