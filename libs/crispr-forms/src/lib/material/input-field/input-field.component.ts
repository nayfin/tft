import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { InputFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';

const InputFieldMixin = crisprControlMixin<InputFieldConfig>(CrisprFieldComponent);
@Component({
  selector: 'crispr-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
