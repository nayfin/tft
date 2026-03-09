import { test } from '../../fixtures/angular-test';
import { textareaFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/textarea/textarea.config';
import { testField } from '../../factory/field-test-factory';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = textareaFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Textarea Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/textarea');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
