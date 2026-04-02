import { test, testForm } from '@tft/crispr-forms-testing';
import { selectFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/select/select.config';

test.describe('Select Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/select');
  });

  testForm(selectFormConfig);
});
