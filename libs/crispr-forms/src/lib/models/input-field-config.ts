import { DynamicFieldConfig } from '../models';

export interface InputFieldConfig extends DynamicFieldConfig {
  inputType?: InputType;
}

type InputType ='button'|
  'checkbox'|
  'color'|
  'date'|
  'datetime-local'|
  'email'|
  'file'|
  'hidden'|
  'image'|
  'month'|
  'number'|
  'password'|
  'radio'|
  'range'|
  'reset'|
  'search'|
  'submit'|
  'tel'|
  'text'|
  'time'|
  'url'|
  'week';
