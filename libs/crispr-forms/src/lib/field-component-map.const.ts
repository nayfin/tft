// tslint:disable-next-line: max-line-length
import type { InputFieldComponent, SelectFieldComponent, AutocompleteFieldComponent,
  AutocompleteChiplistFieldComponent, TextareaFieldComponent, CheckboxFieldComponent,
  RadioFieldComponent, FileUploadFieldComponent, SliderFieldComponent, DatepickerFieldComponent,
  HeadingComponent, DividerComponent, ButtonComponent, UnitConversionFieldComponent, ImageUploadFieldComponent } from './material';
import type { FormGroupListComponent } from './form-group-list/form-group-list.component';
import type { SubGroupComponent } from './sub-group/sub-group.component';
import { isControlConfig } from './form.helpers';
import { ControlType } from './models';

export const FIELD_COMPONENTS = {
  groupList: import('./form-group-list').then (({FormGroupListComponent}) => FormGroupListComponent),
  subGroup: import('./sub-group').then(({ SubGroupComponent}) =>  SubGroupComponent),
  button: import('./material').then(({ ButtonComponent}) =>  ButtonComponent),
  input: import('./material').then(({ InputFieldComponent}) =>  InputFieldComponent),
  select: import('./material').then(({ SelectFieldComponent}) =>  SelectFieldComponent),
  radio: import('./material').then(({ RadioFieldComponent}) =>  RadioFieldComponent),
  autocomplete: import('./material').then(({ AutocompleteFieldComponent}) =>  AutocompleteFieldComponent),
  autocompleteChiplist: import('./material').then(({ AutocompleteChiplistFieldComponent}) =>  AutocompleteChiplistFieldComponent),
  textarea: import('./material').then(({ TextareaFieldComponent}) =>  TextareaFieldComponent),
  checkbox: import('./material').then(({ CheckboxFieldComponent}) =>  CheckboxFieldComponent),
  slider: import('./material').then(({ SliderFieldComponent}) =>  SliderFieldComponent),
  datepicker: import('./material').then(({ DatepickerFieldComponent}) =>  DatepickerFieldComponent),
  fileUpload: import('./material').then(({ FileUploadFieldComponent}) =>  FileUploadFieldComponent),
  imageUpload: import('./material').then(({ ImageUploadFieldComponent}) =>  ImageUploadFieldComponent),
  heading: import('./material').then(({ HeadingComponent}) =>  HeadingComponent),
  divider: import('./material').then(({ DividerComponent}) =>  DividerComponent),
  unitConversion: import('./material').then(({ UnitConversionFieldComponent}) =>  UnitConversionFieldComponent)
};

export function isControlComponent(component: CrisprFieldComponent): component is CrisprControlComponent {
  return component && isControlConfig(component.config) && 'value' in component // || component.config.controlType === ControlType.BUTTON;
}

export function isControlOrButtonComponent(component: CrisprFieldComponent): component is CrisprControlOrButton {
  return isControlComponent(component) || component.config.controlType === ControlType.BUTTON;
}

export type CrisprControlOrButton = CrisprControlComponent | ButtonComponent;

export type CrisprControlComponent = InputFieldComponent |
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

export type CrisprFieldComponent = CrisprControlComponent |
  HeadingComponent |
  DividerComponent |
  ButtonComponent;

