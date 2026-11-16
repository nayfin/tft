import { test, testForm } from '@tft/crispr-forms-testing';
import { unitConversionFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/unit-conversion/unit-conversion.config';

test.describe('Unit Conversion Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/unit-conversion');
  });

  testForm(unitConversionFormConfig);
});
