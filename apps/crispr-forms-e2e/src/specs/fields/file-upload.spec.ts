import { test, testForm } from '@tft/crispr-forms-testing';
import { fileUploadFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/file-upload/file-upload.config';

test.describe('File Upload Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/file-upload');
  });

  testForm(fileUploadFormConfig);
});
