import { FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { TooltipPosition, ThemePalette, MatFormFieldAppearance } from '@angular/material';
import { ErrorDictionary } from '@tft/form-validation-handler';
import { ComputeFieldConfig, CheckControlConfig, CheckControlsConfig } from '../form.helpers';
import { SelectFieldConfig, HeadingConfig, ButtonConfig, DatepickerFieldConfig,
  InputFieldConfig, CheckboxFieldConfig, TextareaFieldConfig,
  AutocompleteFieldConfig, FormGroupListConfig  } from '../models';
import { SliderFieldConfig } from './slider-field.config';

/**
 * The base interface for all the fields in the form's config
 */
export interface CrisprFieldConfig {
  controlType: ControlType;
  label?: string;
  placeholder?: string;
  info?: Info;
  classes?: string[];
}

export interface ControlFieldConfig extends CrisprFieldConfig {
  controlName: string;
  value?: string | number;
  validators?: ValidatorFn[];
  fieldSuffix?: string;
  // TODO: Determine if this is necessary
  computeFieldConfig?: ComputeFieldConfig;
  disabledCallback?: (group: FormGroup, config?: any ) => Observable<boolean>;
  disabledCallbackConfig?: CheckControlConfig | CheckControlsConfig | any; // any is required for user defined configs
  hideDisabled?: boolean; // defaults to false
  heading?: HeadingConfig;
  appearance?: MatFormFieldAppearance;
  color?: ThemePalette;
}
export interface Info {
  content: string;
  tooltipPosition?: TooltipPosition;
  iconName?:string;
}

export interface FormConfig extends ControlFieldConfig{
  errorDictionary?: ErrorDictionary;
  autocomplete?: 'off' | 'on';
  fields: AnyFieldConfig[];
}

export type AnyFieldConfig = SelectFieldConfig
  | InputFieldConfig
  | FormGroupListConfig
  | FormConfig
  | AutocompleteFieldConfig
  | TextareaFieldConfig
  | CheckboxFieldConfig
  | DatepickerFieldConfig
  | SliderFieldConfig
  | HeadingConfig
  | ButtonConfig;

export enum ControlType {
  AUTOCOMPLETE = 'autocomplete',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  GROUP = 'group',
  GROUP_LIST = 'groupList',
  DATEPICKER = 'datepicker',
  SLIDER = 'slider',
  BUTTON = 'button',
  HEADING = 'heading',
  DIVIDER = 'divider'
}
