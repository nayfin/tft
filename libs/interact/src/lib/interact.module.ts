import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './directives/draggable.directive';
import { ResizableDirective } from './directives/resizable.directive';
import { DropzoneDirective } from './directives/dropzone.directive';

const DIRECTIVES = [
  DraggableDirective,
  ResizableDirective,
  DropzoneDirective
];


@NgModule({
  imports: [CommonModule],
  declarations: [
    ...DIRECTIVES
  ],
  exports: [
    ...DIRECTIVES
  ]
})
export class InteractModule {}
