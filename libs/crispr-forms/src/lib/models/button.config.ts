import { CrisprFieldConfig, ControlType, FieldDescriptors, MatFieldProperties, Info } from './crispr-field.config';
import { ThemePalette } from '@angular/material/core';
import { FormGroup } from '@angular/forms';

export interface ButtonConfig extends CrisprFieldConfig,
  MatFieldProperties {
  label?: string;
  controlType: ControlType.BUTTON;
  type?: 'submit' | 'reset' | 'button';
  callback?: (group?: FormGroup, event?: MouseEvent) => unknown;
  buttonType?: MatButtonType;
  color?: ThemePalette;
  icon?: string;
  info?: Omit<Info, 'iconName'>;
  disabledOnInvalidForm?: boolean;
}

export type ButtonType = 'submit' | 'reset' | 'button';

type MatButtonType = 'raised' | 'flat' | 'stroked' | 'icon'; // TODO: 'fab' || 'mini-fab'
