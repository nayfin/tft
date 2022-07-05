import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldContainerComponent } from '../field-container';
import { InfoComponent } from '@tft/crispr-forms/ui/info';
import { OptionComponent } from '../option';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
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
    MatSliderModule
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
