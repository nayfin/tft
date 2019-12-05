import { OptionsType, SelectOption, ReactiveOptionsConfig, CrisprFieldConfig } from '../models';

export interface AutocompleteFieldConfig extends CrisprFieldConfig {
  emptyOptionsMessage?: string;
  options: OptionsType;
  reactiveOptionsConfig: ReactiveOptionsConfig;
  filterFunction?: (options: SelectOption[], searchString: string) => SelectOption[];
}

// export const DEFAULT_EMPTY_OPTIONS_MESSAGE = 'No Items';
