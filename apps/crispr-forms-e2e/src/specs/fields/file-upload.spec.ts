import {
  test,
  expect,
  getMatFormField,
  testForm,
} from '@tft/crispr-forms-testing';
import { fileUploadFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/file-upload/file-upload.config';

test.describe('File Upload Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/file-upload');
  });

  testForm(fileUploadFormConfig);

  test('calls filesChanged once with the selected files', async ({ page }) => {
    const log = page.locator('[data-testid="files-changed-log"] li');
    await expect(log).toHaveCount(0);

    await getMatFormField(page, 'fileUpload')
      .locator('input[type="file"]')
      .setInputFiles([
        { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('a') },
        { name: 'b.txt', mimeType: 'text/plain', buffer: Buffer.from('b') },
      ]);

    await expect(page.locator('crispr-selected-file')).toHaveCount(2);
    await expect(log).toHaveCount(1);
    await expect(log).toHaveText('a.txt,b.txt');
  });
});
