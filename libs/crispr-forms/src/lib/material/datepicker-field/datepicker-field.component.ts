import { Component, OnInit, ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { Observable, of } from 'rxjs';
import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FieldContainerComponent } from '../../field-container';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { crisprControlMixin, CrisprFieldComponent, DatepickerFieldConfig } from '@tft/crispr-forms/utils';

const defaultConfig: Partial<DatepickerFieldConfig> = {
  startView: 'month',
}
const DatepickerFieldMixin = crisprControlMixin<DatepickerFieldConfig>(CrisprFieldComponent);

@Component({
  selector: 'crispr-datepicker-field',
  templateUrl: './datepicker-field.component.html',
  styleUrls: ['./datepicker-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FieldContainerComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDateFnsModule,
    PortalModule
  ],
})
export class DatepickerFieldComponent extends DatepickerFieldMixin implements OnInit, AfterContentInit {

  defaultConfig = defaultConfig;

  dateClass: MatCalendarCellClassFunction<Date>;
  dateClass$: Observable<MatCalendarCellClassFunction<Date>>;
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
