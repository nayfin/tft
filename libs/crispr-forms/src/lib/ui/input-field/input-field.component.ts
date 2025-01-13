/* eslint-disable @nx/enforce-module-boundaries */
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import { InfoComponent } from '../info';
import { InputFieldConfig } from '../../utils';
import { MatIconModule } from '@angular/material/icon';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

@Component({
  selector: 'crispr-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    InfoComponent,
    ReactiveFormsModule,
    FieldContainerComponent,
    MatFormFieldModule,
    MatInputModule,
    FormValidationHandlerModule,
    MatIconModule
  ],
})
export class InputFieldComponent extends CrisprControlComponent<InputFieldConfig> implements OnInit {

  defaultConfig: Partial<InputFieldConfig> = {inputType: 'text'};
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
