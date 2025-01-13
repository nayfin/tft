/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import {
  CrisprFieldComponent,
  CheckboxFieldConfig,
} from '../../utils';
import { InfoComponent } from '../info';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

const defaultConfig: Partial<CheckboxFieldConfig> = {
  labelPosition: 'after',
  inline: false,
};

@Component({
  selector: 'crispr-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    InfoComponent,
    MatCheckboxModule,
    ReactiveFormsModule,
    FieldContainerComponent,
    FormValidationHandlerModule
],
})
export class CheckboxFieldComponent
  extends CrisprControlComponent<CheckboxFieldConfig>
  implements OnInit
{
  defaultConfig = defaultConfig;
  ngOnInit() {
    super.ngOnInit();
  }
}
