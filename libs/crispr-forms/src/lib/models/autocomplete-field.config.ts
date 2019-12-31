import { OptionsType, SelectOption, ControlFieldConfig } from '../models';

export interface AutocompleteFieldConfig extends ControlFieldConfig {
  emptyOptionsMessage?: string;
  options: OptionsType;
  reactiveOptions?: boolean;
  autoActiveFirstOption?: boolean;
  filterFunction?: (options: SelectOption[], searchString: string) => SelectOption[];
}

// export const DEFAULT_EMPTY_OPTIONS_MESSAGE = 'No Items';
