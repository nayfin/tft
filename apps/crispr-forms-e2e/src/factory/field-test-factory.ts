import { test } from '../fixtures/angular-test';
import {
  AnyFieldConfig,
  ControlType,
  InputFieldConfig,
  TextareaFieldConfig,
  CheckboxFieldConfig,
  SelectFieldConfig,
  SliderFieldConfig,
  DatepickerFieldConfig,
  AutocompleteFieldConfig,
  AutocompleteChiplistFieldConfig,
  FileUploadFieldConfig,
  UnitConversionFieldConfig,
} from '@tft/crispr-forms/utils';
import { testInputField } from './field-tests/input.tests';
import { testTextareaField } from './field-tests/textarea.tests';
import { testCheckboxField } from './field-tests/checkbox.tests';
import { testSelectField } from './field-tests/select.tests';
import { testSliderField } from './field-tests/slider.tests';
import { testDatepickerField } from './field-tests/datepicker.tests';
import { testAutocompleteField } from './field-tests/autocomplete.tests';
import { testAutocompleteChiplistField } from './field-tests/autocomplete-chiplist.tests';
import { testFileUploadField } from './field-tests/file-upload.tests';
import { testUnitConversionField } from './field-tests/unit-conversion.tests';

export function testField(config: AnyFieldConfig) {
  // Skip non-control fields
  if (!('controlName' in config)) return;

  test.describe(config.controlName, () => {
    switch (config.controlType) {
      case ControlType.INPUT:
        testInputField(config as InputFieldConfig);
        break;
      case ControlType.TEXTAREA:
        testTextareaField(config as TextareaFieldConfig);
        break;
      case ControlType.CHECKBOX:
        testCheckboxField(config as CheckboxFieldConfig);
        break;
      case ControlType.SELECT:
        testSelectField(config as SelectFieldConfig);
        break;
      case ControlType.SLIDER:
        testSliderField(config as SliderFieldConfig);
        break;
      case ControlType.DATEPICKER:
        testDatepickerField(config as DatepickerFieldConfig);
        break;
      case ControlType.AUTOCOMPLETE:
        testAutocompleteField(config as AutocompleteFieldConfig);
        break;
      case ControlType.AUTOCOMPLETE_CHIPLIST:
        testAutocompleteChiplistField(config as AutocompleteChiplistFieldConfig);
        break;
      case ControlType.FILE_UPLOAD:
        testFileUploadField(config as FileUploadFieldConfig);
        break;
      case ControlType.UNIT_CONVERSION:
        testUnitConversionField(config as UnitConversionFieldConfig);
        break;
    }
  });
}
