import { CrisprFieldConfig } from './crispr-field.config';
import { ThemePalette } from '@angular/material';

export interface ButtonConfig extends CrisprFieldConfig {
  buttonType: 'raised' | 'flat' | 'stroked' | 'icon'; // TODO: 'fab' || 'mini-fab'
  color?: ThemePalette;
  icon?: string;
  disabledOnInvalidForm?: boolean;
}