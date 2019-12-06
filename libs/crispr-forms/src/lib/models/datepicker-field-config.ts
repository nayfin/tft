import { CrisprFieldConfig } from '../models';

export interface DatepickerFieldConfig extends CrisprFieldConfig {
  min: Date;
  max: Date;
}
