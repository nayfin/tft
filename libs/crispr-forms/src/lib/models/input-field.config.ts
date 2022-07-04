import { ControlType, FieldDescriptors, MatFieldProperties, CrisprControlConfig } from './crispr-field.config';

export interface InputFieldConfig extends CrisprControlConfig,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.INPUT,
  inputType?: InputType;
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number;
  pattern?: string;
  autofocus?: boolean;
  spellcheck?: boolean;
  autoComplete?: string;
  autoCapitalize?: 'off' | 'on';
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

