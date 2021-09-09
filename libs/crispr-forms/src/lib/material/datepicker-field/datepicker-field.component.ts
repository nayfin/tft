import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DatepickerFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';

const defaultConfig: Partial<DatepickerFieldConfig> = {
  startView: 'month',
}
const DatepickerFieldMixin = crisprControlMixin<DatepickerFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-datepicker-field',
  templateUrl: './datepicker-field.component.html',
  styleUrls: ['./datepicker-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerFieldComponent extends DatepickerFieldMixin implements OnInit {

  defaultConfig = defaultConfig;

  dateClass: MatCalendarCellClassFunction<Moment>;
  dateClass$: Observable<MatCalendarCellClassFunction<Moment>>;
  startAt$: Observable<Date>;

  ngOnInit() {
    super.ngOnInit();
    this.startAt$ = this.config.startAt instanceof Date
      ? of(this.config.startAt)
      : this.config.startAt instanceof Function
      ? this.config.startAt(this.group)
      : of(null);
    this.dateClass = this.config?.cellClassFunction || null
    this.dateClass$ = this.config.dateClass ? this.config?.dateClass(this.group) : of(() => '');
  }

}
