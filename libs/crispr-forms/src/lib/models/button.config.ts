import { CrisprFieldConfig } from './crispr-field.config';

export interface ButtonConfig extends CrisprFieldConfig {
  buttonType: 'raised' | 'flat' | 'stroked' | 'icon'; // TODO: 'fab' || 'mini-fab'
  color?: string;
  icon?: string;
  disabledOnInvalidForm?: boolean;
}