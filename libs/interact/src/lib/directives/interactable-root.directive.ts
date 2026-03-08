import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[tftDragRoot]',
    standalone: false
})
export class DragRootDirective {
  constructor(public el: ElementRef) { }
}
