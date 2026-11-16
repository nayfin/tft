import { test, testForm } from '@tft/crispr-forms-testing';
import { inputFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/input/input.config';

test.describe('Input Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/input');
  });

  testForm(inputFormConfig);
});
