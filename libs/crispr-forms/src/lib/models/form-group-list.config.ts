import { ThemePalette } from '@angular/material/core';
import { CrisprControlConfig, ControlType } from './';
import { SubGroupConfig } from './crispr-field.config';

// TODO: Below type would be ideal type to use for itemConfig, but there were some issues getting it to work
// export type GroupListItemConfig = Omit<SubGroupConfig, 'controlName'> & {
//   /**
//    * @deprecated controlName doesn't do anything in the itemConfig and should be removed
//    *  */
//   controlName?: string;
// }

export interface FormGroupListConfig extends CrisprControlConfig {
  controlType: ControlType.GROUP_LIST;
  itemConfig: SubGroupConfig; // TODO: should be GroupListItemConfig but having issues working it out
  addItemLabel?: string;
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
  displayInitialItem?: boolean;
  addButtonColor?: ThemePalette;
}
