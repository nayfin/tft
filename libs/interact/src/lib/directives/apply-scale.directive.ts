import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[tftApplyScale]',
  standalone: true,
  host: {
    '[style.font-size]': 'scale() + "px"',
  },
})
export class ApplyScaleDirective {
  el = inject(ElementRef);

  scale = input(1);
}
