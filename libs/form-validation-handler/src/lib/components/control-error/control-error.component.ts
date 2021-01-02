import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'tft-control-error',
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
 })
 export class ControlErrorComponent {
  _text: string;
  _hide = true;

  @Input() set text(value: string) {
    console.log({value, text: this._text})
    if (value !== this._text) {
      this._text = value;
      this._hide = !value;
    }
    this.cdr.detectChanges();
  }

  constructor(private cdr: ChangeDetectorRef) { }

}
