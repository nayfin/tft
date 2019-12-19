import { ControlFieldConfig, FormConfig } from './';

export interface FormGroupListConfig extends ControlFieldConfig {
  itemConfig: FormConfig;
  addItemLabel?: string;
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
}
