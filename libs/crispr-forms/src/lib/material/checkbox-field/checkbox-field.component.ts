import { Component, OnInit, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CheckboxFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { CommonModule } from '@angular/common';
import { InfoModule } from '../info/info.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { CrisprFieldModule } from '../../field.directive';
import { FieldContainerModule } from '../../field-container';

const defaultConfig: Partial<CheckboxFieldConfig> = {
  labelPosition: 'after',
  inline: false
}
const CheckboxFieldMixin = crisprControlMixin<CheckboxFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  styleUrls: ['./checkbox-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxFieldComponent extends CheckboxFieldMixin implements OnInit {

  defaultConfig = defaultConfig;
  ngOnInit() {
    super.ngOnInit();
  }
}
@NgModule({
  imports: [
    CommonModule,
    InfoModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    CrisprFieldModule,
    FieldContainerModule
  ],
  exports: [
    CheckboxFieldComponent
  ],
  declarations: [
    CheckboxFieldComponent
  ]
})

export class CheckboxFieldModule {
}
