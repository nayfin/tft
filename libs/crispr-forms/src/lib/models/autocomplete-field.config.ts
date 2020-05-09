import { OptionsType, SelectOption, ControlFieldConfig } from '../models';

export interface AutocompleteFieldConfig extends ControlFieldConfig {
  typeToEmit?: boolean;
  typeDebounceTime?: number;
  emptyOptionsMessage?: string;
  options: OptionsType;
  // reactiveOptions?: boolean;
  autoActiveFirstOption?: boolean;
  filterFunction?: (options: SelectOption[], searchString: string) => SelectOption[];
}
