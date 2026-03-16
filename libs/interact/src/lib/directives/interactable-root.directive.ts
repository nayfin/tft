import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
    selector: '[tftDragRoot]',
    standalone: false
})
export class DragRootDirective {
  el = inject(ElementRef);
}
