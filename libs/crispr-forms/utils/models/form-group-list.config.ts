import { ThemePalette } from '@angular/material/core';
import { CrisprControlConfig, ControlType, SubGroupConfig } from './crispr-field.config';

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
  itemLabelBuilder?: (index: number) => string;
  /** The number of list items that a user can delete */
  minListLength?: number;
  /** If no items are passed as an initial value, should an initial empty item be created */
  displayInitialItem?: boolean;
  addButtonColor?: ThemePalette;
  addButtonLabel?: string;
  /**
   * @deprecated Please use addButtonLabel, addItemLabel will be removed in the next major release
   */
  addItemLabel?: string;
}
