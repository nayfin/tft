import { ControlType, FieldDescriptors, MatFieldProperties, CrisprControlConfig } from './crispr-field.config';

export interface InputFieldConfig extends CrisprControlConfig,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.INPUT,
  inputType?: InputType;
  min?: number;
  max?: number;
  /**
   * Only applies when `inputType` is `'number'`. When true, the control value is a
   * number (an empty input yields `null`) instead of a string. Defaults to false.
   * In this mode `maxLength`, `pattern`, `spellcheck` and `autoCapitalize` are not applied.
   */
  valueAsNumber?: boolean;
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

