/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
 import { Observable } from 'rxjs';


 import { MatRadioModule } from '@angular/material/radio';
 import { ReactiveFormsModule } from '@angular/forms';
 import { CommonModule } from '@angular/common';
 import { FormValidationHandlerModule } from '@tft/form-validation-handler';
 import { FieldContainerComponent } from '@tft/crispr-forms/ui/field-container';
 import { CrisprFieldComponent, crisprControlMixin, RadioFieldConfig, SelectOption, observablifyOptions } from '@tft/crispr-forms/utils';

const RadioFieldMixin = crisprControlMixin<RadioFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-radio-field',
  templateUrl: './radio-field.component.html',
  styleUrls: ['./radio-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FieldContainerComponent,
    MatRadioModule,
    FormValidationHandlerModule,
  ],
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
