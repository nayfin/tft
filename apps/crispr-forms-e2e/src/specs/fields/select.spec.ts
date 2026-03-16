import { test } from '@tft/crispr-forms-testing';
import { selectFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/select/select.config';
import { testField } from '@tft/crispr-forms-testing';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = selectFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Select Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/select');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
