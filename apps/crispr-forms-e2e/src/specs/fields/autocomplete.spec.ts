import { test, testForm } from '@tft/crispr-forms-testing';
import { autocompleteFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/autocomplete/autocomplete.config';

test.describe('Autocomplete Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/autocomplete');
  });

  testForm(autocompleteFormConfig);
});
