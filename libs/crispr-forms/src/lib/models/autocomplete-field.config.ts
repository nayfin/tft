import { OptionsType, SelectOption, ReactiveOptionsConfig, ControlFieldConfig } from '../models';

export interface AutocompleteFieldConfig extends ControlFieldConfig {
  emptyOptionsMessage?: string;
  options: OptionsType;
  reactiveOptionsConfig: ReactiveOptionsConfig;
  filterFunction?: (options: SelectOption[], searchString: string) => SelectOption[];
}

// export const DEFAULT_EMPTY_OPTIONS_MESSAGE = 'No Items';
