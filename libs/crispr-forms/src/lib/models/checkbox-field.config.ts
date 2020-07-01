import { ControlFieldConfig, ControlType } from '../models';

export interface CheckboxFieldConfig extends ControlFieldConfig {
  controlType: ControlType.CHECKBOX;
  labelPosition?: 'before' | 'after';
  initialValue?: boolean;
  // TODO: @david I think we might be able to get rid of this after changing 'text' to 'label'
  inline?: boolean;
}
