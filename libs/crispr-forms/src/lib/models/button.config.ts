import { CrisprFieldConfig, ControlType, FieldDescriptors, MatFieldProperties, Info } from './crispr-field.config';
import { ThemePalette } from '@angular/material/core';
import { FormGroup } from '@angular/forms';

export interface ButtonConfig extends CrisprFieldConfig,
  Pick<FieldDescriptors, 'label'>,
  MatFieldProperties {

  controlType: ControlType.BUTTON;
  type?: 'submit' | 'reset' | 'button';
  callback?: (group?: FormGroup, event?: MouseEvent) => unknown;
  buttonType?: ButtonType;
  color?: ThemePalette;
  icon?: string;
  info?: Omit<Info, 'iconName'>;
  disabledOnInvalidForm?: boolean;
}

type ButtonType = 'raised' | 'flat' | 'stroked' | 'icon'; // TODO: 'fab' || 'mini-fab'
