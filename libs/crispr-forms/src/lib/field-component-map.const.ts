/* eslint-disable @nrwl/nx/enforce-module-boundaries */
// tslint:disable-next-line: max-line-length
import type { FormGroupListComponent } from './form-group-list/form-group-list.component';
import type { SubGroupComponent } from './sub-group/sub-group.component';
import type { HeadingComponent, InputFieldComponent, SelectFieldComponent, AutocompleteFieldComponent,
  TextareaFieldComponent, CheckboxFieldComponent,
  RadioFieldComponent, FileUploadFieldComponent, SliderFieldComponent,
  DividerComponent, ButtonComponent, UnitConversionFieldComponent } from '@tft/crispr-forms/ui';
import type { ImageUploadFieldComponent } from '@tft/crispr-forms/ui/image-upload-field';
import type { DatepickerFieldComponent } from '@tft/crispr-forms/ui/datepicker-field';
import type { AutocompleteChiplistFieldComponent } from '@tft/crispr-forms/ui/autocomplete-chiplist-field';

import { isControlConfig, ControlType } from '@tft/crispr-forms/utils';

export const FIELD_COMPONENTS = {
  groupList: import('./form-group-list').then (({FormGroupListComponent}) => FormGroupListComponent),
  subGroup: import('./sub-group').then(({ SubGroupComponent}) =>  SubGroupComponent),
  button: import('@tft/crispr-forms/ui').then(({ ButtonComponent}) =>  ButtonComponent),
  input: import('@tft/crispr-forms/ui').then(({ InputFieldComponent}) =>  InputFieldComponent),
  select: import('@tft/crispr-forms/ui').then(({ SelectFieldComponent}) =>  SelectFieldComponent),
  radio: import('@tft/crispr-forms/ui').then(({ RadioFieldComponent}) =>  RadioFieldComponent),
  autocomplete: import('@tft/crispr-forms/ui').then(({ AutocompleteFieldComponent}) =>  AutocompleteFieldComponent),
  autocompleteChiplist: import('@tft/crispr-forms/ui/autocomplete-chiplist-field').then(({ AutocompleteChiplistFieldComponent}) =>  AutocompleteChiplistFieldComponent),
  textarea: import('@tft/crispr-forms/ui').then(({ TextareaFieldComponent}) =>  TextareaFieldComponent),
  checkbox: import('@tft/crispr-forms/ui').then(({ CheckboxFieldComponent}) =>  CheckboxFieldComponent),
  slider: import('@tft/crispr-forms/ui').then(({ SliderFieldComponent}) =>  SliderFieldComponent),
  datepicker: import('@tft/crispr-forms/ui/datepicker-field').then(({ DatepickerFieldComponent}) =>  DatepickerFieldComponent),
  fileUpload: import('@tft/crispr-forms/ui').then(({ FileUploadFieldComponent}) =>  FileUploadFieldComponent),
  imageUpload: import('@tft/crispr-forms/ui/image-upload-field').then(({ ImageUploadFieldComponent}) =>  ImageUploadFieldComponent),
  heading: import('@tft/crispr-forms/ui').then(({ HeadingComponent}) =>  HeadingComponent),
  divider: import('@tft/crispr-forms/ui').then(({ DividerComponent}) =>  DividerComponent),
  unitConversion: import('@tft/crispr-forms/ui').then(({ UnitConversionFieldComponent}) =>  UnitConversionFieldComponent)
};

export function isControlComponent(component: CrisprFieldComponentType): component is CrisprControlComponentType {
  return component && isControlConfig(component.config) && 'value' in component // || component.config.controlType === ControlType.BUTTON;
}

export function isControlOrButtonComponent(component: CrisprFieldComponentType): component is CrisprControlOrButton {
  return isControlComponent(component) || component.config.controlType === ControlType.BUTTON;
}

export type CrisprControlOrButton = CrisprControlComponentType | ButtonComponent;

export type CrisprControlComponentType = InputFieldComponent |
  SelectFieldComponent |
  RadioFieldComponent |
  SubGroupComponent |
  FormGroupListComponent |
  AutocompleteFieldComponent |
  AutocompleteChiplistFieldComponent |
  TextareaFieldComponent |
  CheckboxFieldComponent |
  SliderFieldComponent |
  FileUploadFieldComponent |
  ImageUploadFieldComponent|
  DatepickerFieldComponent |
  UnitConversionFieldComponent;

export type ComponentKeys = keyof typeof FIELD_COMPONENTS;
// export type CrisprFieldComponent = FIELD_COMPONENTS[ComponentKeys];

export type CrisprFieldComponentType = CrisprControlComponentType |
  HeadingComponent |
  DividerComponent |
  ButtonComponent;

