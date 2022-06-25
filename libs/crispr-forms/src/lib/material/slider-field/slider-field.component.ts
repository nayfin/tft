import { Component, OnInit, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { SliderFieldConfig } from '../../models';
import { CrisprFieldComponent, crisprControlMixin } from '../../abstracts';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldContainerModule } from '../../field-container';
import { InfoModule } from '../info/info.component';
import { OptionModule } from '../option';

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
@NgModule({
  imports: [
    CommonModule,
    InfoModule,
    OptionModule,
    FieldContainerModule,
    ReactiveFormsModule,
    MatSliderModule
  ],
  exports: [
    SliderFieldComponent
  ],
  declarations: [
    SliderFieldComponent
  ]
})
export class SliderFieldModule {
}
