import { test, testForm } from '@tft/crispr-forms-testing';
import { textareaFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/textarea/textarea.config';

test.describe('Textarea Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/textarea');
  });

  testForm(textareaFormConfig);
});
