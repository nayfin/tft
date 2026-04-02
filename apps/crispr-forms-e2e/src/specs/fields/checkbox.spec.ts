import { test, testForm } from '@tft/crispr-forms-testing';
import { checkboxFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/checkbox/checkbox.config';

test.describe('Checkbox Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/checkbox');
  });

  testForm(checkboxFormConfig);
});
