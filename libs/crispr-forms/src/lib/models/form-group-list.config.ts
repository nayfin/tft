import { CrisprControlConfig, ControlType } from './';
import { SubGroupConfig } from './crispr-field.config';

export type GroupListItemConfig = Omit<SubGroupConfig, 'controlName'> & {
  /**
   * @deprecated controlName doesn't do anything in the itemConfig and should be removed
   *  */
  controlName?: string;
}

export interface FormGroupListConfig extends CrisprControlConfig {
  controlType: ControlType.GROUP_LIST;
  itemConfig: GroupListItemConfig;
  addItemLabel?: string;
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
}
