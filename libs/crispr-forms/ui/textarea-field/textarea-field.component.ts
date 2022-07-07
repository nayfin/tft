import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldContainerComponent } from '@tft/crispr-forms/ui/field-container';
import { InfoComponent } from '@tft/crispr-forms/ui/info';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { crisprControlMixin, CrisprFieldComponent, TextareaFieldConfig } from '@tft/crispr-forms/utils';

const defaultConfig: Partial<TextareaFieldConfig> = {rows: 5};
const TextareaFieldMixin = crisprControlMixin<TextareaFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
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
export class TextareaFieldComponent extends TextareaFieldMixin implements OnInit {
  defaultConfig = defaultConfig;

  ngOnInit() {
    super.ngOnInit()
  }
}
