import { CrisprControlConfig, ControlType } from '../models';
import { AutocompleteOptionsCallback, SelectOption } from './select-field.config';
import { FieldDescriptors } from './crispr-field.config';

export interface AbstractAutocompleteFieldConfig extends CrisprControlConfig, FieldDescriptors {
  typeToEmit?: boolean;
  typeDebounceTime?: number;
  emptyOptionsMessage?: string;
  options: AutocompleteOptionsCallback;
  autoActiveFirstOption?: boolean;
  imageUrlParam?: string;
}

export interface AutocompleteFieldConfig extends AbstractAutocompleteFieldConfig {
  controlType: ControlType.AUTOCOMPLETE;
}
