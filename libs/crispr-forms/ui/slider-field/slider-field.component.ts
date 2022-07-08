/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OptionComponent } from '../option';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '@tft/crispr-forms/ui/field-container';
import { InfoComponent } from '@tft/crispr-forms/ui/info';
import { SliderFieldConfig, CrisprFieldComponent, crisprControlMixin } from '@tft/crispr-forms/utils';

const defaultConfig = {displayLimits: true};
const SliderFieldMixin = crisprControlMixin<SliderFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-slider-field',
  templateUrl: './slider-field.component.html',
  styleUrls: ['./slider-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
    OptionComponent,
    FieldContainerComponent,
    ReactiveFormsModule,
    MatSliderModule,
    FormValidationHandlerModule,
  ],
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
