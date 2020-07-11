import { CrisprFieldConfig, ControlType, FieldDescriptors, MatFieldProperties } from './crispr-field.config';
import { ThemePalette } from '@angular/material/core';

export interface ButtonConfig extends CrisprFieldConfig,
  Pick<FieldDescriptors, 'label'>,
  MatFieldProperties {

  controlType: ControlType.BUTTON;
  buttonType?: ButtonType;
  color?: ThemePalette;
  icon?: string;
  disabledOnInvalidForm?: boolean;
}

type ButtonType = 'raised' | 'flat' | 'stroked' | 'icon'; // TODO: 'fab' || 'mini-fab'
