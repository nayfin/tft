import { test } from '../../fixtures/angular-test';
import { autocompleteFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/autocomplete/autocomplete.config';
import { testField } from '../../factory/field-test-factory';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = autocompleteFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Autocomplete Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/autocomplete');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
