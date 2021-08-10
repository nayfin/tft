// tslint:disable-next-line: max-line-length
import { InputFieldComponent, SelectFieldComponent, AutocompleteFieldComponent,
  AutocompleteChiplistFieldComponent, TextareaFieldComponent, CheckboxFieldComponent,
  RadioFieldComponent, FileUploadComponent, SliderFieldComponent, DatepickerFieldComponent,
  HeadingComponent, DividerComponent, ButtonComponent, UnitConversionFieldComponent } from './material';
import { FormGroupListComponent } from './form-group-list/form-group-list.component';
import { isControlConfig } from './form.helpers';
import { ControlType } from './models';
import { SubGroupComponent } from './sub-group/sub-group.component';

export const FIELD_COMPONENTS = {
  button: ButtonComponent,
  input: InputFieldComponent,
  select: SelectFieldComponent,
  radio: RadioFieldComponent,
  subGroup: SubGroupComponent,
  groupList: FormGroupListComponent,
  autocomplete: AutocompleteFieldComponent,
  autocompleteChiplist: AutocompleteChiplistFieldComponent,
  textarea: TextareaFieldComponent,
  checkbox: CheckboxFieldComponent,
  slider: SliderFieldComponent,
  datepicker: DatepickerFieldComponent,
  fileUpload: FileUploadComponent,
  heading: HeadingComponent,
  divider: DividerComponent,
  unitConversion: UnitConversionFieldComponent
};

export function isControlComponent(component: CrisprFieldComponent): component is CrisprControlComponent {
  return isControlConfig(component.config) || component.config.controlType === ControlType.BUTTON;
}

export type CrisprControlComponent = ButtonComponent |
  InputFieldComponent |
  SelectFieldComponent |
  RadioFieldComponent |
  SubGroupComponent |
  FormGroupListComponent |
  AutocompleteFieldComponent |
  AutocompleteChiplistFieldComponent |
  TextareaFieldComponent |
  CheckboxFieldComponent |
  SliderFieldComponent |
  FileUploadComponent |
  DatepickerFieldComponent |
  UnitConversionFieldComponent;

export type ComponentKeys = keyof typeof FIELD_COMPONENTS;
// export type CrisprFieldComponent = FIELD_COMPONENTS[ComponentKeys];

export type CrisprFieldComponent = CrisprControlComponent |
  HeadingComponent|
  DividerComponent;

