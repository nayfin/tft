/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterContentInit,
} from '@angular/core';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { Observable, of } from 'rxjs';
import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { FieldContainerComponent } from '../field-container';
import {
  DatepickerFieldConfig,
} from '../../utils';
import { CrisprControlComponent } from '../../utils/abstracts/crispr-control.abstract';

const defaultConfig: Partial<DatepickerFieldConfig> = {
  startView: 'month',
};

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
    PortalModule,
    FormValidationHandlerModule,
  ],
})
export class DatepickerFieldComponent
  extends CrisprControlComponent<DatepickerFieldConfig>
  implements OnInit, AfterContentInit
{
  defaultConfig = defaultConfig;

  dateClass: MatCalendarCellClassFunction<Date>;
  dateClass$: Observable<MatCalendarCellClassFunction<Date>>;
  startAt$: Observable<Date>;

  /** A portal containing the footer component type for this calendar. */
  calendarFooterPortal: Portal<any>;

  ngOnInit() {
    super.ngOnInit();
    const config = this.config();
    this.startAt$ =
      config.startAt instanceof Date
        ? of(config.startAt)
        : config.startAt instanceof Function
        ? config.startAt(this.group)
        : of(null);
    this.dateClass = config?.cellClassFunction || null;
    this.dateClass$ = config.dateClass
      ? config?.dateClass(this.group)
      : of(() => '');
  }

  ngAfterContentInit() {
    if (this.config().datepickerActions) {
      this.calendarFooterPortal = new ComponentPortal(
        this.config().datepickerActions
      );
    }
  }

  // handleSelectedChange(event, picker: MatDatepicker<unknown>) {
  //   console.log({event, picker})
  //   if(this.config.selectedChange) {
  //     this.config.selectedChange(event, picker);
  //   }
  // }
}
