/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import { InfoComponent } from '../info';
import {
  SliderFieldConfig,
  CrisprFieldComponent,
  crisprControlMixin,
} from '../../utils';

const defaultConfig: Partial<SliderFieldConfig> = { 
  displayLimits: true,
  displayWith: (val) => val,
};
const SliderFieldMixin =
  crisprControlMixin<SliderFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-slider-field',
  templateUrl: './slider-field.component.html',
  styleUrls: ['./slider-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
    FieldContainerComponent,
    ReactiveFormsModule,
    MatSliderModule,
    /**
     * TODO: Adding validation module causes error
     * TypeError: You provided 'null' where a stream was expected. You can provide an Observable,
     * Promise, ReadableStream, Array, AsyncIterable, or Iterable.
     */
    // FormValidationHandlerModule,
  ],
})
export class SliderFieldComponent extends SliderFieldMixin implements OnInit {
  defaultConfig = defaultConfig;
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
