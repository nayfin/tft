import { FormGroup, ValidatorFn, Validator } from '@angular/forms';
import { Observable } from 'rxjs';
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

/**
 * The base interface for all the fields in the form's config
 */
export interface CrisprFieldConfig {
  controlType?: ControlType;
  classes?: string[];
  component?: any; // TODO: make
}

// export function isCustomConfig(config: AnyFieldConfig): config is CustomFieldConfig {
//   return 'component' in config;
// }
// export interface CustomFieldConfig extends CrisprFieldConfig {
//   controlType: ControlType.CUSTOM;
//   component?: any; // TODO: type better
// }

/**
 * The base interface for all control configs
 */
export interface CrisprControlConfig extends CrisprFieldConfig {
  controlName: string;
  controlType: ControlType;
  validators?: ValidatorFn[];
  // TODO: Determine if this is necessary
  computeFieldConfig?: ComputeFieldConfig;
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
export interface AbstractGroupConfig<C extends CrisprFieldConfig = AnyFieldConfig>  {
  fields?: (AnyFieldConfig | C)[];
}
export interface FormConfig<C = AnyFieldConfig> extends AbstractGroupConfig<C> {
  // DEPRECATED: Remove in v11
  controlType?: string;
  // DEPRECATED: Remove in v11
  controlName?: string;
  classes?: string[];
  errorDictionary?: ErrorDictionary;
  autocomplete?: 'off' | 'on';
  validators?: ValidatorFn[]
}
/**
 * Configuration for SubGroup components
 */
export interface SubGroupConfig extends CrisprControlConfig, AbstractGroupConfig {
  controlType: ControlType.GROUP | ControlType.SUB_GROUP;
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
  | HeadingConfig
  | ButtonConfig
  | DividerConfig;
  // | CustomFieldConfig;

export type ControlValue = boolean | string | number | Date | SelectOption | SelectOption[];

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
  // DEPRECATED: GROUP, remove in v11
  GROUP = 'group',
  GROUP_LIST = 'groupList',
  DATEPICKER = 'datepicker',
  SLIDER = 'slider',
  BUTTON = 'button',
  HEADING = 'heading',
  DIVIDER = 'divider',
  CUSTOM = 'custom'
};
