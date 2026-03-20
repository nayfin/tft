# CRISPR Forms Configuration Models

This document serves as a reference for the core configuration models used by the `@tft/crispr-forms` library. When defining a `FormConfig` or any `FieldConfig`, use these structures as your guide. Note: The `MapFieldConfig` is intentionally excluded per integration guidelines.

## Form Config Overview
```typescript
interface FormConfig {
  fields: AnyFieldConfig[]; // The array of controls in the form
  classes?: string[]; // CSS classes applied to the root form element
  errorDictionary?: ErrorDictionary; // Global error messages by validator key
  validators?: ValidatorFn[]; // Cross-field validators
  autoComplete?: string; // HTML autocomplete attribute
}
```

## Abstract Field Configurations

### `CrisprFieldConfig` (Base of all fields)
```typescript
interface CrisprFieldConfig {
  controlType?: ControlType; // Required on specific implementations
  classes?: string[]; // Custom classes to apply to the field wrapper
}
```

### `CrisprControlConfig` (Base of all input controls)
```typescript
// Extends CrisprFieldConfig
interface CrisprControlConfig<M = null> extends CrisprFieldConfig {
  controlName: string; // The property name in the resulting FormGroup value
  controlType: ControlType;
  validators?: ValidatorFn[]; // Array of standard Angular validators
  computeValue?: (group: FormGroup) => Observable<unknown>; // Reactively compute this field's value
  disabledCallback?: (group: FormGroup) => Observable<boolean>; // Reactively disable/enable this field
  hideDisabled?: boolean; // If true, the field disappears from the DOM when disabled
  heading?: HeadingConfig; // Display a heading above this specific control
  hint?: string; // Mat-form-field hint text
}
```

### `FieldDescriptors` & `MatFieldProperties` (Common properties)
```typescript
interface FieldDescriptors {
  label: string; 
  info?: { content: string, tooltipPosition?: TooltipPosition, iconName?: string }; // Tooltip info icon
  fieldSuffix?: string;
  placeholder?: string;
}

interface MatFieldProperties {
  appearance?: MatFormFieldAppearance; // 'fill' | 'outline' etc.
  color?: ThemePalette; // 'primary' | 'accent' | 'warn'
}
```

---

## Specific Field Configurations

### Input Field (`ControlType.INPUT`)
```typescript
interface InputFieldConfig extends CrisprControlConfig, FieldDescriptors, MatFieldProperties {
  controlType: ControlType.INPUT;
  inputType?: 'color'|'date'|'email'|'number'|'password'|'search'|'tel'|'text'|'time'|'url';
  min?: number;
  max?: number;
  maxLength?: number;
  step?: number;
  pattern?: string;
}
```

### Select Field (`ControlType.SELECT`)
```typescript
interface SelectFieldConfig extends CrisprControlConfig, FieldDescriptors, MatFieldProperties {
  controlType: ControlType.SELECT;
  emptyOptionsMessage?: string;
  multiple?: boolean;
  options: SelectOption[] | Observable<SelectOption[]> | OptionsCallback | Promise<SelectOption[]>;
}

interface SelectOption {
  label: string;
  value: any;
}
```

### Checkbox Field (`ControlType.CHECKBOX`)
```typescript
interface CheckboxFieldConfig extends CrisprControlConfig {
  controlType: ControlType.CHECKBOX;
  label: string; // The label next to the checkbox
  color?: ThemePalette;
  labelPosition?: 'before' | 'after';
}
```

### Button (`ControlType.BUTTON`)
```typescript
interface ButtonConfig extends CrisprFieldConfig, MatFieldProperties {
  label?: string;
  controlType: ControlType.BUTTON;
  type?: 'submit' | 'reset' | 'button'; // The HTML button type
  callback?: (group?: FormGroup, event?: MouseEvent) => unknown; // Custom click handler
  buttonType?: 'raised' | 'flat' | 'stroked' | 'icon'; // Material button variant
  icon?: string;
  disabledOnInvalidForm?: boolean; // Automatically toggles based on overall form status
}
```

### Sub Group (`ControlType.SUB_GROUP`)
```typescript
interface SubGroupConfig extends CrisprControlConfig {
  controlType: ControlType.SUB_GROUP;
  fields: AnyFieldConfig[]; // The nested controls
}
```

### Form Group List / Form Array (`ControlType.GROUP_LIST`)
```typescript
interface FormGroupListConfig extends CrisprControlConfig {
  controlType: ControlType.GROUP_LIST;
  itemConfig: SubGroupConfig; // The config representing a SINGLE item in the list
  itemLabelBuilder?: (index: number) => string;
  minListLength?: number;
  displayInitialItem?: boolean;
  addButtonLabel?: string;
}
```

### Autocomplete Field (`ControlType.AUTOCOMPLETE`)
```typescript
interface AutocompleteFieldConfig extends CrisprControlConfig, FieldDescriptors, MatFieldProperties {
  controlType: ControlType.AUTOCOMPLETE;
  typeToEmit?: boolean;
  typeDebounceTime?: number;
  emptyOptionsMessage?: string;
  options: AutocompleteOptionsCallback;
  autoActiveFirstOption?: boolean;
  imageUrlParam?: string;
  displayWith?: (options: SelectOption[]) => (value: unknown) => string;
}
```

### Autocomplete Chiplist Field (`ControlType.AUTOCOMPLETE_CHIPLIST`)
```typescript
interface AutocompleteChiplistFieldConfig extends AutocompleteFieldConfig {
  controlType: ControlType.AUTOCOMPLETE_CHIPLIST;
  chipsSelectable?: boolean;
  areChipsRemovable?: boolean;
  allowDuplicates?: boolean;
  duplicateCompareFunction?: (chip: SelectOption, availableOption: SelectOption) => boolean;
  separatorKeyCodes?: number[];
  tabToSelect?: boolean;
  /** Optional. When set, adds a "Create New" option at the bottom of the autocomplete dropdown
   *  that opens an inline CDK overlay sub-form for creating a new chip with a complex value. */
  createChip?: CreateChipConfig;
}

interface CreateChipConfig {
  /** Label for the "Create New" option in the autocomplete dropdown. Defaults to '+ Create New'. */
  createLabel?: string;
  /** Fields to render inside the create-chip overlay sub-form. */
  fields: AnyFieldConfig[];
  /** Called when the user submits the sub-form. Must return an Observable that emits the new SelectOption. */
  submitChip: (group: FormGroup) => Observable<SelectOption>;
  /** Label for the submit button inside the overlay. Defaults to 'Add'. */
  submitLabel?: string;
}
```

### Datepicker Field (`ControlType.DATEPICKER`)
```typescript
interface DatepickerFieldConfig extends CrisprControlConfig, MatFieldProperties {
  controlType: ControlType.DATEPICKER;
  label: string;
  min?: Date;
  max?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  startAt?: Date | ((group: FormGroup) => Observable<Date>) | null;
  touchUi?: boolean;
  datepickerFilter?: (date: Date) => boolean;
}
```

### Divider (`ControlType.DIVIDER`)
```typescript
// Subclass of FieldConfig, does not have label/controlName
interface DividerConfig extends CrisprFieldConfig {
  controlType?: ControlType.DIVIDER;
  vertical?: boolean;
}
```

### File Upload Field (`ControlType.FILE_UPLOAD`)
```typescript
interface FileUploadFieldConfig extends CrisprControlConfig, MatFieldProperties {
  controlType: ControlType.FILE_UPLOAD;
  label: string;
  filesChanged?: (parentGroup: FormGroup, files: FileList) => void;
  allowMultipleFiles?: boolean;
  showClearFilesButton?: boolean;
  acceptedTypes?: string;
  dropZoneText?: string;
  // If Using Upload Button
  uploadFiles?: (parentGroup: FormGroup, files: FileList, uploadComponent: AbstractUploadComponent) => Promise<unknown> | unknown;
  showUploadProgress?: boolean;
  disableOnUpload?: boolean;
}
```

### Heading (`ControlType.HEADING`)
```typescript
interface HeadingConfig extends CrisprFieldConfig {
  controlType?: ControlType.HEADING;
  typographyClass?: string;
  label: string;
}
```

### Image Upload Field (`ControlType.IMAGE_UPLOAD`)
```typescript
interface ImageUploadFieldConfig extends CrisprControlConfig, MatFieldProperties {
  controlType: ControlType.IMAGE_UPLOAD;
  label: string;
  filesChanged?: (parentGroup: FormGroup, file: File) => void;
  acceptedTypes: string;
  fileName?: string;
  showClearFilesButton?: boolean;
  dropZoneText?: string;
  compressImage?: boolean;
  targetCompressedImageFileSizeMb?: number;
  minCompressionThresholdMb?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  imagePreviewHeight?: string;
}
```

### Radio Field (`ControlType.RADIO`)
```typescript
interface RadioFieldConfig extends CrisprControlConfig, MatFieldProperties {
  controlType: ControlType.RADIO;
  options: OptionsType; // Same as SelectField OptionsType
}
```

### Slider Field (`ControlType.SLIDER`)
```typescript
interface SliderFieldConfig extends CrisprControlConfig {
  controlType: ControlType.SLIDER;
  label: string;
  color?: ThemePalette;
  displayWith?: (value: number) => string | number;
  max?: number;
  min?: number;
  step?: number;
  discrete?: boolean;
  tickInterval?: number | 'auto';
  displayLimits?: boolean;
}
```

### Textarea Field (`ControlType.TEXTAREA`)
```typescript
interface TextareaFieldConfig extends CrisprControlConfig, FieldDescriptors, MatFieldProperties {
  controlType: ControlType.TEXTAREA;
  rows?: number;
}
```

### Map Field (`ControlType.MAP`)
```typescript
interface MapFieldConfig extends CrisprControlConfig, FieldDescriptors, MatFieldProperties {
  controlType: ControlType.MAP;
  label: string;
  center?: google.maps.LatLngLiteral;
  location?: string;
  options?: google.maps.MapOptions;
  /** Optional overrides for the Places Autocomplete request.
   *  `input` is always set from the search term and cannot be overridden here.
   *  Defaults: includedPrimaryTypes: ['postal_code', 'administrative_area_level_2', 'administrative_area_level_3'],
   *            language: 'en-US', region: 'us'. */
  searchAutocompleteRequest?: Omit<google.maps.places.AutocompleteRequest, 'input'>;
  debounceTime?: number;
  markers?: (map: GoogleMap, group: FormGroup) => Observable<TftMapMarker[]>;
  infoWindowTemplateBuilder?: (props: TftMapMarker) => string;
  valueDisplayKey?: string;
  onMove?: (map: GoogleMap, group: FormGroup) => unknown;
}
```

### Unit Conversion Field (`ControlType.UNIT_CONVERSION`)
```typescript
interface UnitConversionFieldConfig<ST = unknown, UT = unknown> extends CrisprControlConfig, FieldDescriptors, MatFieldProperties {
  controlType: ControlType.UNIT_CONVERSION;
  initialDisplayValueConversion: (value?: ST, displayedUnit?: UT) => number;
  storedValueConversion: (value?: string, displayedUnit?: UT) => number;
  min?: number;
  max?: number;
  step?: number;
  showUnitSelect: boolean;
  selectableUnits?: (group: FormGroup) => OptionsType;
  initialDisplayUnit?: UT;
}
```
