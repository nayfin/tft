import { AbstractAutocompleteFieldConfig } from './index';
import { ControlType, FieldDescriptors, MatFieldProperties } from './crispr-field.config';

export interface AutocompleteChiplistFieldConfig extends AbstractAutocompleteFieldConfig,
  FieldDescriptors,
  MatFieldProperties {
  controlType: ControlType.AUTOCOMPLETE_CHIPLIST;
  autoActiveFirstOption?: boolean;
  chipsSelectable?: boolean;
  areChipsRemovable?: boolean;
  allowDuplicates?: boolean;
  /**
   * Pass in any key codes to use for selection
   */
  separatorKeyCodes?: number[];
  addChipOnBlur?: boolean;
}
