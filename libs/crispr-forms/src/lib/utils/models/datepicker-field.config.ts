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
   *
   * The component must be standalone and import the Material directives its buttons use. Its Cancel and Apply
   * buttons do nothing unless it imports `MatDatepickerCancel` and `MatDatepickerApply` (from
   * `@angular/material/datepicker`), because a `matDatepickerCancel` or `matDatepickerApply` attribute is inert
   * without its directive.
   */
  datepickerActions?: ComponentType<any>;
  /**
   * Show a small text button next to the datepicker toggle while the control has a value and is enabled.
   * Clicking it empties the control and marks it dirty and touched, so a required field shows its required error.
   * Defaults to `false`.
   */
  clearable?: boolean;
  /**
   * The visible text of the clear button, which is also its accessible name. Only used when `clearable` is `true`.
   * Defaults to `'Clear'`.
   */
  clearButtonLabel?: string;
}
