import { CrisprControlConfig, ControlType } from '../models';
import { AutocompleteOptionsCallback } from './select-field.config';
import { FieldDescriptors, MatFieldProperties } from './crispr-field.config';

export interface AbstractAutocompleteFieldConfig extends CrisprControlConfig,
  FieldDescriptors,
  MatFieldProperties
  {
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
