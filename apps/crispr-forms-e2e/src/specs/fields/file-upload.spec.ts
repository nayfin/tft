import { test } from '../../fixtures/angular-test';
import { fileUploadFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/file-upload/file-upload.config';
import { testField } from '../../factory/field-test-factory';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = fileUploadFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('File Upload Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/file-upload');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
