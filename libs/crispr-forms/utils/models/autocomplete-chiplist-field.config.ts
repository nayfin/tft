import { AbstractAutocompleteFieldConfig } from './autocomplete-field.config';
import { SelectOption } from './select-field.config';

import { ControlType, FieldDescriptors, MatFieldProperties } from './crispr-field.config';

export interface AutocompleteChiplistFieldConfig extends AbstractAutocompleteFieldConfig,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.AUTOCOMPLETE_CHIPLIST;
  autoActiveFirstOption?: boolean;
  chipsSelectable?: boolean;
  areChipsRemovable?: boolean;
  allowDuplicates?: boolean;
  duplicateCompareFunction?: (chip: SelectOption, availableOption: SelectOption) => boolean,
  /**
   * Pass in any key codes to use for selection
   */
  separatorKeyCodes?: number[];
  tabToSelect?: boolean;
  /**
   * @deprecated replaced with tabToSelect as it is more accurate
   */
  addChipOnBlur?: boolean;
}
