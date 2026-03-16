import { test } from '@tft/crispr-forms-testing';
import { checkboxFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/checkbox/checkbox.config';
import { testField } from '@tft/crispr-forms-testing';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = checkboxFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Checkbox Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/checkbox');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
