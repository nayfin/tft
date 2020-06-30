import { ControlFieldConfig, FormConfig, ControlType, ControlValue } from './';

export interface FormGroupListConfig<T = any> extends ControlFieldConfig {
  controlType: ControlType.GROUP_LIST;
  value?: Partial<T>[];
  itemConfig: FormConfig;
  addItemLabel?: string;
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
}
