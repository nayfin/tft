import { CrisprControlConfig, FormConfig, ControlType, ControlValue } from './';
import { SubGroupConfig } from './crispr-field.config';

export interface FormGroupListConfig extends CrisprControlConfig {
  controlType: ControlType.GROUP_LIST;
  itemConfig: SubGroupConfig;
  addItemLabel?: string;
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
}
