import { CrisprFieldConfig } from './crispr-field.config';

export interface ButtonConfig extends CrisprFieldConfig {
  buttonType: 'raised' | 'flat' | 'stroked' | 'icon'; // 'fab' || 'mini-fab'
  icon?: string;
}