import { AbstractAutocompleteFieldConfig } from './autocomplete-field.config';
import { SelectOption } from './select-field.config';
import { ControlType, FieldDescriptors, MatFieldProperties } from './crispr-field.config';
import type { CreateChipConfig } from './create-chip.config';

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
  /** Config for creating new chips with complex values via an inline sub-form */
  createChip?: CreateChipConfig;
}
