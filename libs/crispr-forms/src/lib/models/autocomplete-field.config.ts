import { ControlFieldConfig, ControlType } from '../models';
import { AutocompleteOptionsCallback, SelectOption } from './select-field.config';

export interface AbstractAutocompleteFieldConfig extends ControlFieldConfig {
  typeToEmit?: boolean;
  typeDebounceTime?: number;
  emptyOptionsMessage?: string;
  options: AutocompleteOptionsCallback;
  autoActiveFirstOption?: boolean;
  imageUrlParam?: string;
}

export interface AutocompleteFieldConfig extends AbstractAutocompleteFieldConfig {
  controlType: ControlType.AUTOCOMPLETE;
  initialValue?: SelectOption;
}
