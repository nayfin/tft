import { CrisprControlConfig } from '../models';
import { ControlType, FieldDescriptors } from './crispr-field.config';

export interface InputFieldConfig extends CrisprControlConfig, FieldDescriptors {
  controlType: ControlType.INPUT,
  inputType?: InputType;
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

