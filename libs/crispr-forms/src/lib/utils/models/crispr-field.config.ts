import { FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatFormFieldAppearance } from '@angular/material/form-field';

import { ErrorDictionary } from '@tft/form-validation-handler';

import type {
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
  RadioFieldConfig,
  ImageUploadFieldConfig,
  FileUploadFieldConfig,
  UnitConversionFieldConfig,
  MapFieldConfig
} from '../models';

import { ThemePalette } from '@angular/material/core';

// export type ControlType = keyof typeof FIELD_COMPONENTS;
export enum ControlType {
  AUTOCOMPLETE = 'autocomplete',
  AUTOCOMPLETE_CHIPLIST = 'autocompleteChiplist',
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
  CUSTOM = 'custom',
  DATEPICKER = 'datepicker',
  DIVIDER = 'divider',
  FILE_UPLOAD = 'fileUpload',
  GROUP_LIST = 'groupList',
  HEADING = 'heading',
  IMAGE_UPLOAD = 'imageUpload',
  INPUT = 'input',
  MAP = 'map',
  RADIO = 'radio',
  SELECT = 'select',
  SLIDER = 'slider',
  SUB_GROUP = 'subGroup',
  TEXTAREA = 'textarea',
  UNIT_CONVERSION = 'unitConversion',
}

/**
 * The base interface for all the fields in the form's config
 */
export interface CrisprFieldConfig {
  controlType?: ControlType;
  classes?: string[];
  component?: any; // TODO: Define this better
}

/**
 * A utility type that returns the keys of a type if one is passed otherwise return string type
 */
type RestrictedControlName<M> = M extends null ? string : keyof M;
/**
 * The base interface for all control configs
 */
export interface CrisprControlConfig<M = null> extends CrisprFieldConfig {
  controlName: RestrictedControlName<M>
  controlType: ControlType;
  validators?: ValidatorFn[];
  computeValue?: (group: FormGroup) => Observable<unknown>;
  disabledCallback?: (group: FormGroup) => Observable<boolean>;
  /**
   * Hide the control when disabled
   * @default false
   */
  hideDisabled?: boolean;
  heading?: HeadingConfig;
  hint?: string;
}

/**
 * Holds properties for control fields that describe field behavior to users
 */
export interface FieldDescriptors {
  label: string;
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
  // this union is needed, it joins any custom config provided by users to our default config options
  fields?: (AnyFieldConfig | C)[];
}
export interface FormConfig<C = AnyFieldConfig> extends AbstractGroupConfig<C> {
  classes?: string[];
  errorDictionary?: ErrorDictionary;
  autoComplete?: string;
  /** @deprecated use autoComplete */
  autocomplete?: string;
  validators?: ValidatorFn[];
}
/**
 * Configuration for SubGroup components
 */
export interface SubGroupConfig extends CrisprControlConfig, AbstractGroupConfig<any> {
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
  | MapFieldConfig
  | SliderFieldConfig
  | FileUploadFieldConfig
  | ImageUploadFieldConfig
  | HeadingConfig
  | ButtonConfig
  | DividerConfig
  | UnitConversionFieldConfig;
  // | CustomFieldConfig;


export type ControlValue<T = any> = boolean | string | number | Date | SelectOption | SelectOption[] | ControlGroupValue | T;

export type ControlGroupValue = {[key: string]: ControlValue};
