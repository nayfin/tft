import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './directives/draggable.directive';
import { ResizableDirective } from './directives/resizable.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DraggableDirective,
    ResizableDirective
  ],
  exports: [
    DraggableDirective,
    ResizableDirective
  ]
})
export class InteractModule {}
