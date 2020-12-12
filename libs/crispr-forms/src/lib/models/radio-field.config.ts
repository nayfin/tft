import { CrisprControlConfig, FieldDescriptors, MatFieldProperties, ControlType } from './crispr-field.config';
import { OptionsType } from './select-field.config';

export interface RadioFieldConfig extends Omit<CrisprControlConfig, 'placeholder'>,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.RADIO,
  options: OptionsType;
}
