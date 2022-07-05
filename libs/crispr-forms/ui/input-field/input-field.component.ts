import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FieldContainerComponent } from '@tft/crispr-forms/ui/field-container';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InfoComponent } from '@tft/crispr-forms/ui/info';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { InputFieldConfig, crisprControlMixin, CrisprFieldComponent } from '@tft/crispr-forms/utils';

const InputFieldMixin = crisprControlMixin<InputFieldConfig>(CrisprFieldComponent);
@Component({
  selector: 'crispr-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
    ReactiveFormsModule,
    FieldContainerComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class InputFieldComponent extends InputFieldMixin implements OnInit {

  defaultConfig: Partial<InputFieldConfig> = {inputType: 'text'};
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
