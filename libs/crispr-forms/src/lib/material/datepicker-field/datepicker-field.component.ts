import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatepickerFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';

const defaultConfig: Partial<DatepickerFieldConfig> = {
  startView: 'month',
}
const CheckboxFieldMixin = crisprControlMixin<DatepickerFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-datepicker-field',
  templateUrl: './datepicker-field.component.html',
  styleUrls: ['./datepicker-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerFieldComponent extends CheckboxFieldMixin implements OnInit {

  defaultConfig = defaultConfig;

  ngOnInit() {
    super.ngOnInit();
  }

}
