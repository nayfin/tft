import { Component, OnInit, ChangeDetectionStrategy, NgModule } from '@angular/core';
 import { Observable } from 'rxjs';

import { SelectOption } from '../../models';
import { observablifyOptions } from '../../form.helpers';
import { CrisprFieldComponent, crisprControlMixin } from '../../abstracts';
import { RadioFieldConfig } from '../../models/radio-field.config';
import { MatRadioModule } from '@angular/material/radio';
import { FieldContainerModule } from '../../field-container';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const RadioFieldMixin = crisprControlMixin<RadioFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-radio-field',
  templateUrl: './radio-field.component.html',
  styleUrls: ['./radio-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioFieldComponent extends RadioFieldMixin implements OnInit {
  defaultConfig = {};
  options$: Observable<SelectOption[]>;
  ngOnInit() {
    super.ngOnInit();
    // options$ can be passed as an array, promise that resolves array, or observable that resolves array
    // this functions accounts for all possibilities and converts to observable that resolves array
    this.options$ = observablifyOptions(this.config.options, this.group);
  }
}
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FieldContainerModule,
    MatRadioModule,
  ],
  exports: [
    RadioFieldComponent
  ],
  declarations: [
    RadioFieldComponent
  ]
})
export class RadioFieldModule {
}
