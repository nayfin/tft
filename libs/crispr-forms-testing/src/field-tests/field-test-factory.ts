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
      case 'input':
        testInputField(config as InputFieldConfig);
        break;
      case 'textarea':
        testTextareaField(config as TextareaFieldConfig);
        break;
      case 'checkbox':
        testCheckboxField(config as CheckboxFieldConfig);
        break;
      case 'select':
        testSelectField(config as SelectFieldConfig);
        break;
      case 'slider':
        testSliderField(config as SliderFieldConfig);
        break;
      case 'datepicker':
        testDatepickerField(config as DatepickerFieldConfig);
        break;
      case 'autocomplete':
        testAutocompleteField(config as AutocompleteFieldConfig);
        break;
      case 'autocompleteChiplist':
        testAutocompleteChiplistField(config as AutocompleteChiplistFieldConfig);
        break;
      case 'fileUpload':
        testFileUploadField(config as FileUploadFieldConfig);
        break;
      case 'unitConversion':
        testUnitConversionField(config as UnitConversionFieldConfig);
        break;
    }
  });
}
