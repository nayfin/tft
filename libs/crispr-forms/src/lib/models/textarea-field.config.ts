import { ControlFieldConfig, ControlType } from '../models';

export interface TextareaFieldConfig extends ControlFieldConfig {
  controlType: ControlType.TEXTAREA;
  rows?: number;
}
