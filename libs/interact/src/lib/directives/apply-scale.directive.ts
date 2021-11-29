import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[tftApplyScale]'
})
export class ApplyScaleDirective {

  _scale = 1;
   // this setup allows consumers to set x, y scale independently or just set them both with scale
  @Input() set scale(val: number){
    this._scale;
    this.fontSize = `${val}px`;
  };

  @HostBinding('style.fontSize') fontSize: string;

  constructor(
    public el: ElementRef
  ) { }
}
