import { Component, OnInit, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextareaFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldContainerModule } from '../../field-container';
import { InfoModule } from '../info/info.component';

const defaultConfig: Partial<TextareaFieldConfig> = {rows: 5};
const TextareaFieldMixin = crisprControlMixin<TextareaFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaFieldComponent extends TextareaFieldMixin implements OnInit {
  defaultConfig = defaultConfig;

  ngOnInit() {
    super.ngOnInit()
  }
}
@NgModule({
  imports: [
    CommonModule,
    InfoModule,
    ReactiveFormsModule,
    FieldContainerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    TextareaFieldComponent
  ],
  declarations: [
    TextareaFieldComponent
  ]
})
export class TextareaFieldModule {
}
