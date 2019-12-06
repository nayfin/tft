import { Component, OnInit } from '@angular/core';
import { DatepickerFieldConfig } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'crispr-datepicker-field',
  templateUrl: './datepicker-field.component.html',
  styleUrls: ['./datepicker-field.component.scss']
})
export class DatepickerFieldComponent implements OnInit {

  config: DatepickerFieldConfig;
  group: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
