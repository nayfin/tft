import type { FormGroupListComponent } from "../form-group-list";
import type { SubGroupComponent } from "../sub-group";
import type { ImageUploadFieldComponent, ButtonComponent, InputFieldComponent, SelectFieldComponent, RadioFieldComponent, AutocompleteFieldComponent, AutocompleteChiplistFieldComponent, TextareaFieldComponent, CheckboxFieldComponent, SliderFieldComponent, FileUploadFieldComponent, DatepickerFieldComponent, UnitConversionFieldComponent, HeadingComponent, DividerComponent } from "../material";

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
  FileUploadFieldComponent |
  ImageUploadFieldComponent|
  DatepickerFieldComponent |
  UnitConversionFieldComponent;

  export type CrisprFieldComponent = CrisprControlComponent |
  HeadingComponent |
  DividerComponent;
