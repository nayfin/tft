import { AbstractAutocompleteFieldConfig } from './index';
import { ControlType } from './crispr-field.config';
import { SelectOption } from './select-field.config';

export interface AutocompleteChiplistFieldConfig extends AbstractAutocompleteFieldConfig {
  controlType: ControlType.AUTOCOMPLETE_CHIPLIST;
  autoActiveFirstOption?: boolean;
  chipsSelectable?: boolean;
  areChipsRemovable?: boolean;
  addChipOnBlur?: boolean;
  allowDuplicates?: boolean;
}
