import type { FormGroupListComponent } from './form-group-list/form-group-list.component';
import type { SubGroupComponent } from './sub-group/sub-group.component';
import type { HeadingComponent } from '../../ui';
import type { ImageUploadFieldComponent } from '../../ui/image-upload-field';
import type { DatepickerFieldComponent } from '../../ui/datepicker-field';
import type { CheckboxFieldComponent } from '../../ui/checkbox-field';
import type { TextareaFieldComponent } from '../../ui/textarea-field';
import type { AutocompleteFieldComponent } from '../../ui/autocomplete-field';
import type { SelectFieldComponent } from '../../ui/select-field';
import type { InputFieldComponent } from '../../ui/input-field';
import type { RadioFieldComponent } from '../../ui/radio-field';
import type { FileUploadFieldComponent } from '../../ui/file-upload-field';
import type { SliderFieldComponent } from '../../ui/slider-field';
import type { DividerComponent } from '../../ui/divider';
import type { ButtonComponent } from '../../ui/button';
import type { UnitConversionFieldComponent } from '../../ui/unit-conversion-field';

import type { AutocompleteChiplistFieldComponent } from '../../ui/autocomplete-chiplist-field';

import { isControlConfig, ControlType } from '../../utils';

export const FIELD_COMPONENTS = {
  groupList: () =>
    import('./form-group-list').then(
      ({ FormGroupListComponent }) => FormGroupListComponent
    ),
  subGroup: () =>
    import('./sub-group').then(({ SubGroupComponent }) => SubGroupComponent),
  button: () =>
    import('../../ui/button').then(
      ({ ButtonComponent }) => ButtonComponent
    ),
  input: () =>
    import('../../ui/input-field').then(
      ({ InputFieldComponent }) => InputFieldComponent
    ),
  select: () =>
    import('../../ui/select-field').then(
      ({ SelectFieldComponent }) => SelectFieldComponent
    ),
  radio: () =>
    import('../../ui/radio-field').then(
      ({ RadioFieldComponent }) => RadioFieldComponent
    ),
  autocomplete: () =>
    import('../../ui/autocomplete-field').then(
      ({ AutocompleteFieldComponent }) => AutocompleteFieldComponent
    ),
  autocompleteChiplist: () =>
    import('../../ui/autocomplete-chiplist-field').then(
      ({ AutocompleteChiplistFieldComponent }) =>
        AutocompleteChiplistFieldComponent
    ),
  textarea: () =>
    import('../../ui/textarea-field').then(
      ({ TextareaFieldComponent }) => TextareaFieldComponent
    ),
  checkbox: () =>
    import('../../ui/checkbox-field').then(
      ({ CheckboxFieldComponent }) => CheckboxFieldComponent
    ),
  slider: () =>
    import('../../ui/slider-field').then(
      ({ SliderFieldComponent }) => SliderFieldComponent
    ),
  datepicker: () =>
    import('../../ui/datepicker-field').then(
      ({ DatepickerFieldComponent }) => DatepickerFieldComponent
    ),
  fileUpload: () =>
    import('../../ui/file-upload-field').then(
      ({ FileUploadFieldComponent }) => FileUploadFieldComponent
    ),
  imageUpload: () =>
    import('../../ui/image-upload-field').then(
      ({ ImageUploadFieldComponent }) => ImageUploadFieldComponent
    ),
  heading: () =>
    import('../../ui').then(
      ({ HeadingComponent }) => HeadingComponent
    ),
  divider: () =>
    import('../../ui/divider').then(
      ({ DividerComponent }) => DividerComponent
    ),
  unitConversion: () =>
    import('../../ui/unit-conversion-field').then(
      ({ UnitConversionFieldComponent }) => UnitConversionFieldComponent
    ),
};

export function isControlComponent(
  component: CrisprFieldComponentType
): component is CrisprControlComponentType {
  return component && isControlConfig(component.config) && 'value' in component; // || component.config.controlType === ControlType.BUTTON;
}

export function isControlOrButtonComponent(
  component: CrisprFieldComponentType
): component is CrisprControlOrButton {
  return (
    isControlComponent(component) ||
    component.config.controlType === ControlType.BUTTON
  );
}

export type CrisprControlOrButton =
  | CrisprControlComponentType
  | ButtonComponent;

export type CrisprControlComponentType =
  | InputFieldComponent
  | SelectFieldComponent
  | RadioFieldComponent
  | SubGroupComponent
  | FormGroupListComponent
  | AutocompleteFieldComponent
  | AutocompleteChiplistFieldComponent
  | TextareaFieldComponent
  | CheckboxFieldComponent
  | SliderFieldComponent
  | FileUploadFieldComponent
  | ImageUploadFieldComponent
  | DatepickerFieldComponent
  | UnitConversionFieldComponent;

export type ComponentKeys = keyof typeof FIELD_COMPONENTS;
// export type CrisprFieldComponent = FIELD_COMPONENTS[ComponentKeys];

export type CrisprFieldComponentType =
  | CrisprControlComponentType
  | HeadingComponent
  | DividerComponent
  | ButtonComponent;
