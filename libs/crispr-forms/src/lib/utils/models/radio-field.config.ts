import { CrisprControlConfig, FieldDescriptors, MatFieldProperties, ControlType } from './crispr-field.config';
import { OptionsType } from './select-field.config';

export interface RadioFieldConfig extends Omit<CrisprControlConfig, 'placeholder'>,
  Omit<FieldDescriptors, 'label'>,
  MatFieldProperties {
  controlType: ControlType.RADIO,
  /**
   * The visible label of the radio group. It is also the group's accessible name.
   * When it is omitted, the group is named by `heading.label` if there is one.
   */
  label?: string;
  options: OptionsType;
}
