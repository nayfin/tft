import { CrisprFieldConfig, ControlType } from './crispr-field.config';
import { ThemePalette } from '@angular/material/core';

export interface ButtonConfig extends CrisprFieldConfig {
  controlType: ControlType.BUTTON;
  buttonType: ButtonType;
  color?: ThemePalette;
  icon?: string;
  disabledOnInvalidForm?: boolean;
}

type ButtonType = 'raised' | 'flat' | 'stroked' | 'icon'; // TODO: 'fab' || 'mini-fab'
