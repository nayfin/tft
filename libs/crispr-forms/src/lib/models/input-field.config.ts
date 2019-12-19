import { ControlFieldConfig } from '../models';

export interface InputFieldConfig extends ControlFieldConfig {
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

