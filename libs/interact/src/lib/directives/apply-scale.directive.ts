import { Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[tftApplyScale]'
})
export class ApplyScaleDirective implements OnChanges {

   // this setup allows consumers to set x, y scale independently or just set them both with scale
  @Input() set scale(val: number){
    this.scaleY = val;
    this.scaleX = val;
  };

  @Input() scaleX = 1;
  @Input() scaleY = 1;

  @HostBinding('style.transform') transform: string;
  @Input() @HostBinding('style.transformOrigin') transformOrigin = '0 0';

  constructor(
    public el: ElementRef
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(_changes: SimpleChanges) {
    this.transform = `scaleX(${this.scaleX}) scaleY(${this.scaleY})`;
  }
}
