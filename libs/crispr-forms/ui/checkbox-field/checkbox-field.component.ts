import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldContainerComponent } from '@tft/crispr-forms/ui/field-container';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { crisprControlMixin, CrisprFieldComponent, CheckboxFieldConfig } from '@tft/crispr-forms/utils';
import { InfoComponent } from '@tft/crispr-forms/ui/info';

const defaultConfig: Partial<CheckboxFieldConfig> = {
  labelPosition: 'after',
  inline: false
}
const CheckboxFieldMixin = crisprControlMixin<CheckboxFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InfoComponent,
    MatCheckboxModule,
    ReactiveFormsModule,
    // CrisprFieldDirective,
    FieldContainerComponent
  ],
})
export class CheckboxFieldComponent extends CheckboxFieldMixin implements OnInit {

  defaultConfig = defaultConfig;
  ngOnInit() {
    super.ngOnInit();
  }
}

