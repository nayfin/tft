import { FieldDescriptors, MatFieldProperties,CrisprControlConfig, ControlType } from './crispr-field.config';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

export interface DatepickerFieldConfig extends CrisprControlConfig,
  Pick<FieldDescriptors, 'label'>,
  MatFieldProperties {
  controlType: ControlType.DATEPICKER;
  min?: Date;
  max?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  startAt?: Date | ((group: FormGroup) => Observable<Date>) | null;
  touchUi?: boolean;
  // TODO: trying to get this event into the mat-datepicker. uncomment if approved remove if not
  // selectedChange?: (event, picker: MatDatepicker<unknown>) => void;
  datepickerFilter?: (date: Date) => boolean;
  cellClassFunction?: MatCalendarCellClassFunction<Date>;
  dateClass?: (parentGroup: FormGroup) => Observable<MatCalendarCellClassFunction<Date>>;
  /**
   * Pass a component into mat-datepicker-actions component see [docs](https://material.angular.io/components/datepicker/overview#confirmation-action-buttons)
   */
  datepickerActions?: ComponentType<any>;
  /**
   * Show a clear button next to the datepicker toggle while the control has a value and is enabled.
   * Clicking it empties the control and marks it dirty and touched, so a required field shows its required error.
   * Defaults to `false`.
   */
  clearable?: boolean;
  /**
   * The accessible name (`aria-label`) of the clear button. Only used when `clearable` is `true`.
   * Defaults to `'Clear date'`.
   */
  clearButtonLabel?: string;
}
