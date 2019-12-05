import { CrisprFieldConfig, FormConfig } from '../models';

export interface FormGroupListConfig extends CrisprFieldConfig {
  itemConfig: FormConfig;
  addItemLabel?: string;
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
}
