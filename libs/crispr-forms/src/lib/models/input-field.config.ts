import { CrisprFieldConfig } from '../models';

export interface InputFieldConfig extends CrisprFieldConfig {
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

