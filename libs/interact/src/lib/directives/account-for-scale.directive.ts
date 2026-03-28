import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Use to apply scale to the element and tell the drag and resize directives to account for the scale when
 * @example <div tftAccountForScale [scale]="2.5"> <div tftDraggable> </div> </div>
 * @note if `dragRoot` is used this directive should be used on the same element to ensure that the drag
 * element accounts for scale
 */
@Directive({
  selector: '[tftAccountForScale]',
  standalone: true,
})
export class AccountForScaleDirective {
  el = inject(ElementRef);

  scale = input(1);
}
