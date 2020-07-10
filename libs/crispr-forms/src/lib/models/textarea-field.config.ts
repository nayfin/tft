import { CrisprControlConfig, ControlType } from '../models';
import { FieldDescriptors } from './crispr-field.config';

export interface TextareaFieldConfig extends CrisprControlConfig, FieldDescriptors {
  controlType: ControlType.TEXTAREA;
  rows?: number;
}
