import { test, testForm } from '@tft/crispr-forms-testing';
import { autocompleteChiplistFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/autocomplete-chiplist/autocomplete-chiplist.config';

test.describe('Autocomplete Chiplist Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/autocomplete-chiplist');
  });

  testForm(autocompleteChiplistFormConfig);
});
