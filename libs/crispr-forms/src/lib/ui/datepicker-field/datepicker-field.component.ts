/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterContentInit,
  computed,
} from '@angular/core';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { Observable, of } from 'rxjs';
import { ComponentPortal, Portal, PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorContainerDirective, ControlErrorsDirective } from '@tft/form-validation-handler';
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
    imports: [
        CommonModule,
        FieldContainerComponent,
        MatDatepickerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDateFnsModule,
        PortalModule,
        ControlErrorContainerDirective,
        ControlErrorsDirective
    ],
    standalone: true
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

  /** Whether the control holds a date. `null`, `undefined` and `''` count as no value. */
  readonly hasValue = computed(() => {
    const value = this.controlValue();
    return value !== null && value !== undefined && value !== '';
  });

  /**
   * Empties the control and marks it dirty and touched, so a required field shows its required error.
   * The control is marked touched before the value changes: the error display only reacts to value and status
   * changes, and ignores them while the control is untouched.
   */
  clear() {
    const control = this.control();
    control.markAsTouched();
    control.markAsDirty();
    control.setValue(null);
  }

  ngOnInit() {
    super.ngOnInit();
    const config = this.config();
    this.startAt$ =
      config.startAt instanceof Date
        ? of(config.startAt)
        : config.startAt instanceof Function
        ? config.startAt(this.group())
        : of(null);
    this.dateClass = config?.cellClassFunction || null;
    this.dateClass$ = config.dateClass
      ? config?.dateClass(this.group())
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
