import { ControlFieldConfig } from '../models';
import { ControlType } from './crispr-field.config';

export interface InputFieldConfig extends ControlFieldConfig {
  controlType: ControlType.INPUT,
  inputType?: InputType;
  initialValue?: string | number;
}

type InputType = 'color'
  |'date'
  |'datetime-local'
  |'email'
  |'month'
  |'number'
  |'password'
  |'search'
  |'tel'
  |'text'
  |'time'
  |'url'
  |'week';

