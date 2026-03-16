import { test } from '@tft/crispr-forms-testing';
import { inputFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/input/input.config';
import { testField } from '@tft/crispr-forms-testing';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = inputFormConfig.fields.filter(f => f.controlType !== ControlType.BUTTON);

test.describe('Input Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/input');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
