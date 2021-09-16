import { Component, OnInit, ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
import { DatepickerFieldConfig } from '../../models';
import { crisprControlMixin, CrisprFieldComponent } from '../../abstracts';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { ComponentPortal, Portal } from '@angular/cdk/portal';

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
export class DatepickerFieldComponent extends DatepickerFieldMixin implements OnInit, AfterContentInit {

  defaultConfig = defaultConfig;

  dateClass: MatCalendarCellClassFunction<Moment>;
  dateClass$: Observable<MatCalendarCellClassFunction<Moment>>;
  startAt$: Observable<Date>;

  /** A portal containing the footer component type for this calendar. */
  calendarFooterPortal: Portal<any>;

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

  ngAfterContentInit() {
    if (this.config.datepickerActions) {
      this.calendarFooterPortal = new ComponentPortal(this.config.datepickerActions);
    }
  }

  // handleSelectedChange(event, picker: MatDatepicker<unknown>) {
  //   console.log({event, picker})
  //   if(this.config.selectedChange) {
  //     this.config.selectedChange(event, picker);
  //   }
  // }
}
