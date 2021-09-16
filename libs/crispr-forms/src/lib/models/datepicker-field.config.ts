import { CrisprControlConfig, ControlType } from '../models';
import { Moment } from 'moment';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';
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
  datepickerFilter?: (date: Moment) => boolean;
  cellClassFunction?: MatCalendarCellClassFunction<Moment>;
  dateClass?: (parentGroup: FormGroup) => Observable<MatCalendarCellClassFunction<Moment>>;
  /**
   * Pass a component into mat-datepicker-actions component see [docs](https://material.angular.io/components/datepicker/overview#confirmation-action-buttons)
   */
  datepickerActions?: ComponentType<any>;
}
