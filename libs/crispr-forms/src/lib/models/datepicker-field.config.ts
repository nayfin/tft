import { CrisprControlConfig, ControlType } from '../models';
import { Moment } from 'moment';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Observable } from 'rxjs';

export interface DatepickerFieldConfig extends CrisprControlConfig,
  Pick<FieldDescriptors, 'label'>,
  MatFieldProperties {
  controlType: ControlType.DATEPICKER;
  min?: Date;
  max?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  startAt?: Date | null;
  touchUi?: boolean;
  datepickerFilter?: (date: Moment) => boolean;
  cellClassFunction?: MatCalendarCellClassFunction<Moment>;
  dateClass$?: Observable<MatCalendarCellClassFunction<Moment>>;
}
