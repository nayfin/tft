import { test } from '@tft/crispr-forms-testing';
import { unitConversionFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/unit-conversion/unit-conversion.config';
import { testField } from '@tft/crispr-forms-testing';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = unitConversionFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Unit Conversion Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/unit-conversion');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
