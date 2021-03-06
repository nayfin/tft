import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SliderFieldConfig } from '../../models';
import { CrisprFieldComponent, crisprControlMixin } from '../../abstracts';

const defaultConfig = {displayLimits: true};
const SliderFieldMixin = crisprControlMixin<SliderFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-slider-field',
  templateUrl: './slider-field.component.html',
  styleUrls: ['./slider-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderFieldComponent extends SliderFieldMixin implements OnInit {

  defaultConfig = defaultConfig;
  constructor() {
    super();
  }

  get flexDirection() {
    return this.config.vertical ? 'column' : 'row';
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
