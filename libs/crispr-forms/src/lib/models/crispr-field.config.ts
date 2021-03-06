import { FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, ObservableInput } from 'rxjs';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { ErrorDictionary } from '@tft/form-validation-handler';
import {
  ComputeFieldConfig,
  CheckControlConfig,
  CheckControlsConfig,
} from '../form.helpers';
import {
  SelectFieldConfig,
  HeadingConfig,
  ButtonConfig,
  DatepickerFieldConfig,
  InputFieldConfig,
  CheckboxFieldConfig,
  TextareaFieldConfig,
  AutocompleteFieldConfig,
  FormGroupListConfig,
  AutocompleteChiplistFieldConfig,
  SliderFieldConfig,
  DividerConfig,
  SelectOption,
  RadioFieldConfig
} from '../models';

import { ThemePalette } from '@angular/material/core';
import { FileUploadFieldConfig } from './file-upload-field.config';

// export type ControlType = keyof typeof FIELD_COMPONENTS;
export enum ControlType {
  AUTOCOMPLETE = 'autocomplete',
  AUTOCOMPLETE_CHIPLIST = 'autocompleteChiplist',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  RADIO = 'radio',
  SUB_GROUP = 'subGroup',
  GROUP_LIST = 'groupList',
  DATEPICKER = 'datepicker',
  SLIDER = 'slider',
  BUTTON = 'button',
  HEADING = 'heading',
  DIVIDER = 'divider',
  FILE_UPLOAD = 'fileUpload',
  CUSTOM = 'custom'
}

/**
 * The base interface for all the fields in the form's config
 */
export interface CrisprFieldConfig {
  controlType?: ControlType;
  classes?: string[];
  component?: any; // TODO: Define this better
}

// export function isCustomConfig(config: AnyFieldConfig): config is CustomFieldConfig {
//   return 'component' in config;
// }
// export interface CustomFieldConfig extends CrisprFieldConfig {
//   controlType: ControlType.CUSTOM;
//   component?: any; // TODO: type better
// }
type RestrictedControlName<M> = M extends null ? string : keyof M;
/**
 * The base interface for all control configs
 */
export interface CrisprControlConfig<M = null> extends CrisprFieldConfig {
  controlName: RestrictedControlName<M>
  controlType: ControlType;
  validators?: ValidatorFn[];
  // TODO: Determine if this is necessary
  /**
   * @deprecated please us computeValue instead
   */
  computeFieldConfig?: ComputeFieldConfig;
  computeValue?: (group: FormGroup) => Observable<unknown>;
  disabledCallback?: (group: FormGroup, config?: any) => Observable<boolean>;
  disabledCallbackConfig?: CheckControlConfig | CheckControlsConfig | any; // any is required for user defined configs
  hideDisabled?: boolean; // defaults to false
  heading?: HeadingConfig;
}

/**
 * Holds properties for control fields that describe field behavior to users
 */
export interface FieldDescriptors {
  label?: string;
  info?: Info;
  fieldSuffix?: string;
  placeholder?: string;
}

export interface MatFieldProperties {
  appearance?: MatFormFieldAppearance;
  color?: ThemePalette;
}

export interface Info {
  content: string;
  tooltipPosition?: TooltipPosition;
  iconName?: string;
}

// TODO: having AnyFieldConfig as the default for C seems redundant and silly
export interface AbstractGroupConfig<C extends CrisprFieldConfig = AnyFieldConfig, M = any>  {
  // this union is needed, it joins any custom config provided by users to our default config options
  fields?: (AnyFieldConfig | C)[];
}
export interface FormConfig<C = AnyFieldConfig> extends AbstractGroupConfig<C> {
  classes?: string[];
  errorDictionary?: ErrorDictionary;
  autocomplete?: 'off' | 'on';
  validators?: ValidatorFn[]
}
/**
 * Configuration for SubGroup components
 */
export interface SubGroupConfig extends CrisprControlConfig, AbstractGroupConfig {
  controlType: ControlType.SUB_GROUP;
}

export type AnyFieldConfig = InputFieldConfig
  | SelectFieldConfig
  | RadioFieldConfig
  | FormGroupListConfig
  | SubGroupConfig
  | AutocompleteFieldConfig
  | AutocompleteChiplistFieldConfig
  | TextareaFieldConfig
  | CheckboxFieldConfig
  | DatepickerFieldConfig
  | SliderFieldConfig
  | FileUploadFieldConfig
  | HeadingConfig
  | ButtonConfig
  | DividerConfig;
  // | CustomFieldConfig;

export type ControlValue = boolean | string | number | Date | SelectOption | SelectOption[];

