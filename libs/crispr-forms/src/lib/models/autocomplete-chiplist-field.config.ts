import { AutocompleteFieldConfig } from './index';

export interface AutocompleteChiplistFieldConfig extends AutocompleteFieldConfig {
  autoActiveFirstOption?: never;
  chipsSelectable?: boolean;
  areChipsRemovable?: boolean;
  addChipOnBlur?: boolean;
  imageUrlParam?: string;

}
