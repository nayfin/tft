import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CheckboxFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';

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
