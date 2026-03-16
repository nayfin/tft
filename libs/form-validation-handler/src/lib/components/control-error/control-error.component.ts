import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, inject } from '@angular/core';
@Component({
    selector: 'tft-control-error',
    templateUrl: './control-error.component.html',
    styleUrls: ['./control-error.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
 export class ControlErrorComponent {
  private cdr = inject(ChangeDetectorRef);

  _text: string;
  _hide = true;

  @Input() set text(value: string) {
    if (value !== this._text) {
      this._text = value;
      this._hide = !value;
    }
    this.cdr.detectChanges();
  }

}
