import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InputFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FieldContainerComponent } from '../../field-container';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InfoComponent } from '../info/info.component';

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
