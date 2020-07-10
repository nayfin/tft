import { CrisprControlConfig, ControlType } from '../models';
import { Moment } from 'moment';
import { FieldDescriptors } from './crispr-field.config';

export interface DatepickerFieldConfig extends CrisprControlConfig, Omit<FieldDescriptors, 'info'> {
  controlType: ControlType.DATEPICKER;
  min?: Date;
  max?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  startAt?: Date | null;
  touchUi?: boolean;
  datepickerFilter?: (date: Moment) => boolean;
}
