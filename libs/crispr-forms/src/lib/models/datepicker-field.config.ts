import { ControlFieldConfig } from '../models';
import { Moment } from 'moment';

export interface DatepickerFieldConfig extends ControlFieldConfig {
  min?: Date;
  max?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  startAt?: Date | null;
  touchUi?: boolean;
  datepickerFilter?: (date: Moment) => boolean;
}
