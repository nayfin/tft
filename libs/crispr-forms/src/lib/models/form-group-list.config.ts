import { ControlFieldConfig, FormConfig, ControlType } from './';

export interface FormGroupListConfig extends ControlFieldConfig {
  controlType: ControlType.GROUP_LIST;
  itemConfig: FormConfig;
  addItemLabel?: string;
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
}
