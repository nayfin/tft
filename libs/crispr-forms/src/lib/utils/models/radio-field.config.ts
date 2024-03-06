import { CrisprControlConfig, FieldDescriptors, MatFieldProperties, ControlType } from './crispr-field.config';
import { OptionsType } from './select-field.config';

export interface RadioFieldConfig extends Omit<CrisprControlConfig, 'placeholder'>,
  Omit<FieldDescriptors, 'label'>,
  MatFieldProperties {
  controlType: ControlType.RADIO,
  options: OptionsType;
}
