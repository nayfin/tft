import { FieldDescriptors, MatFieldProperties, CrisprControlConfig, ControlType } from './crispr-field.config';

export interface TextareaFieldConfig extends CrisprControlConfig,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.TEXTAREA;
  rows?: number;
}
