import { test } from '@playwright/test';
import type {
  AnyFieldConfig,
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
import { ControlType } from '@tft/crispr-forms/utils'
import { testInputField } from './input.tests';
import { testTextareaField } from './textarea.tests';
import { testCheckboxField } from './checkbox.tests';
import { testSelectField } from './select.tests';
import { testSliderField } from './slider.tests';
import { testDatepickerField } from './datepicker.tests';
import { testAutocompleteField } from './autocomplete.tests';
import { testAutocompleteChiplistField } from './autocomplete-chiplist.tests';
import { testFileUploadField } from './file-upload.tests';
import { testUnitConversionField } from './unit-conversion.tests';

/**
 * Registers a `test.describe` block for a field config, automatically selecting
 * the correct test suite based on `controlType`.
 *
 * Non-control fields (heading, divider, button) are skipped silently.
 *
 * @example
 * ```ts
 * import { testField } from '@tft/crispr-forms-testing';
 * import { myFormConfig } from './my-form.config';
 *
 * test.describe('My Form', () => {
 *   test.beforeEach(async ({ page }) => page.goto('/my-form'));
 *   for (const field of myFormConfig.fields) {
 *     testField(field);
 *   }
 * });
 * ```
 */
export function testField(config: AnyFieldConfig) {
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
