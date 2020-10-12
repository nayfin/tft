import { CrisprControlConfig, ControlType } from '../models';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';

export interface CheckboxFieldConfig extends
  CrisprControlConfig,
  Pick<FieldDescriptors, 'label' | 'info'>,
  Pick<MatFieldProperties, 'color'>
  {
  controlType: ControlType.CHECKBOX;
  labelPosition?: 'before' | 'after';
  // TODO: @david I think we might be able to get rid of this after changing 'text' to 'label'
  inline?: boolean;
}
