import { test } from '../../fixtures/angular-test';
import { autocompleteChiplistFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/autocomplete-chiplist/autocomplete-chiplist.config';
import { testField } from '../../factory/field-test-factory';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = autocompleteChiplistFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Autocomplete Chiplist Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/autocomplete-chiplist');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
