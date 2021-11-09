import { Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Use to apply scale to the element and tell the drag and resize directives to account for the scale when
 * @example <div tftAccountForScale [scale]="2.5"> <div tftDraggable> </div> </div>
 * @note if `dragRoot` is used this directive should be used on the same element to ensure that the drag
 * element accounts for scale
 */
@Directive({
  selector: '[tftAccountForScale]'
})
export class AccountForScaleDirective implements OnChanges {
  // this setup allows consumers to set x, y scale independently or just set them both with scale
  @Input() set scale(val: number){
    this.scaleY = val;
    this.scaleX = val;
  };

  @Input() scaleX = 1;
  @Input() scaleY = 1;

  @HostBinding('style.transform') transform: string;

  constructor(
    public el: ElementRef
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(_changes: SimpleChanges) {
    this.transform = `scaleX(${this.scaleX}) scaleY(${this.scaleY})`;
  }
}
