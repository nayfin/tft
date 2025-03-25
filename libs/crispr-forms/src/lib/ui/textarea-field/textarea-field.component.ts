/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import { InfoComponent } from '../info';
import {
  TextareaFieldConfig,
} from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

const defaultConfig: Partial<TextareaFieldConfig> = { rows: 5 };

@Component({
  selector: 'crispr-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    InfoComponent,
    ReactiveFormsModule,
    FieldContainerComponent,
    MatFormFieldModule,
    MatInputModule,
    FormValidationHandlerModule
],
})
export class TextareaFieldComponent
  extends CrisprControlComponent<TextareaFieldConfig>
  implements OnInit
{
  defaultConfig = defaultConfig;

  ngOnInit() {
    super.ngOnInit();
  }
}
