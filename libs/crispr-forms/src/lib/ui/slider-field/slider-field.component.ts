/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { ReactiveFormsModule } from '@angular/forms';
// import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import { InfoComponent } from '../info';
import {
  SliderFieldConfig
} from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

const defaultConfig: Partial<SliderFieldConfig> = { 
  displayLimits: true,
  displayWith: (val) => val,
};


@Component({
  selector: 'crispr-slider-field',
  templateUrl: './slider-field.component.html',
  styleUrls: ['./slider-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    InfoComponent,
    FieldContainerComponent,
    ReactiveFormsModule,
    MatSliderModule
],
})
export class SliderFieldComponent extends CrisprControlComponent<SliderFieldConfig> implements OnInit {
  defaultConfig = defaultConfig;
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
