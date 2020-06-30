// tslint:disable-next-line: max-line-length
import { InputFieldComponent, SelectFieldComponent, AutocompleteFieldComponent, AutocompleteChiplistFieldComponent, TextareaFieldComponent, CheckboxFieldComponent, SliderFieldComponent, DatepickerFieldComponent, HeadingComponent, DividerComponent, ButtonComponent } from './material';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormGroupListComponent } from './form-group-list/form-group-list.component';
import { isControlField } from './form.helpers';
import { ControlType } from './models';

export const FIELD_COMPONENTS = {
  button: ButtonComponent,
  input: InputFieldComponent,
  select: SelectFieldComponent,
  group: FormGroupComponent,
  groupList: FormGroupListComponent,
  autocomplete: AutocompleteFieldComponent,
  autocompleteChiplist: AutocompleteChiplistFieldComponent,
  textarea: TextareaFieldComponent,
  checkbox: CheckboxFieldComponent,
  slider: SliderFieldComponent,
  datepicker: DatepickerFieldComponent,
  heading: HeadingComponent,
  divider: DividerComponent
};

export function isControlComponent(component: CrisprFieldComponent): component is CrisprControlComponent {
  return isControlField(component.config) || component.config.controlType === ControlType.BUTTON;
}

export type CrisprControlComponent = ButtonComponent|
  InputFieldComponent|
  SelectFieldComponent|
  FormGroupComponent|
  FormGroupListComponent|
  AutocompleteFieldComponent|
  AutocompleteChiplistFieldComponent|
  TextareaFieldComponent|
  CheckboxFieldComponent|
  SliderFieldComponent|
  DatepickerFieldComponent;

// export type ComponentKeys = keyof typeof FIELD_COMPONENTS;
// export type CrisprFieldComponents = typeof FIELD_COMPONENTS[ComponentKeys];

export type CrisprFieldComponent = CrisprControlComponent |
  HeadingComponent|
  DividerComponent;
