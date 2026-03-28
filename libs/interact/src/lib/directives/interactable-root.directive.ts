import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[tftDragRoot]',
  standalone: true,
})
export class DragRootDirective {
  el = inject(ElementRef);
}
