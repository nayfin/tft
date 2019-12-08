import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatepickerFieldConfig } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'crispr-datepicker-field',
  templateUrl: './datepicker-field.component.html',
  styleUrls: ['./datepicker-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerFieldComponent implements OnInit {

  config: DatepickerFieldConfig;
  group: FormGroup;

  constructor() { }


  ngOnInit() {
  }

}
