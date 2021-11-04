import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[tftDragRoot]'
})
export class DragRootDirective {

  constructor(
    public el: ElementRef
  ) { }

}
