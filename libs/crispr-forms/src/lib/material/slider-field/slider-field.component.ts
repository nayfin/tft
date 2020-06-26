import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SliderFieldConfig } from '../../models';
import { CrisprFieldComponent, crisprControlMixin } from '../../field.component.abstract';

const SliderFieldMixin = crisprControlMixin<SliderFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-slider-field',
  templateUrl: './slider-field.component.html',
  styleUrls: ['./slider-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderFieldComponent extends SliderFieldMixin {

  defaultConfig = {displayLimits: true}
  constructor() {
    super();
    super.ngOnInit();
  }
  get flexDirection() {
    return this.config.vertical ? 'column' : 'row';
  }


}
