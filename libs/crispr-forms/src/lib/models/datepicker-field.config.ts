import { CrisprControlConfig, ControlType } from '../models';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

export interface DatepickerFieldConfig extends CrisprControlConfig,
  Pick<FieldDescriptors, 'label'>,
  MatFieldProperties {
  controlType: ControlType.DATEPICKER;
  min?: Date;
  max?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  startAt?: Date | ((group: UntypedFormGroup) => Observable<Date>) | null;
  touchUi?: boolean;
  // TODO: trying to get this event into the mat-datepicker. uncomment if approved remove if not
  // selectedChange?: (event, picker: MatDatepicker<unknown>) => void;
  datepickerFilter?: (date: Date) => boolean;
  cellClassFunction?: MatCalendarCellClassFunction<Date>;
  dateClass?: (parentGroup: UntypedFormGroup) => Observable<MatCalendarCellClassFunction<Date>>;
  /**
   * Pass a component into mat-datepicker-actions component see [docs](https://material.angular.io/components/datepicker/overview#confirmation-action-buttons)
   */
  datepickerActions?: ComponentType<any>;
}
