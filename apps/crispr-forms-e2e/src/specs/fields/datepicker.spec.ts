import { test, testForm } from '@tft/crispr-forms-testing';
import { datepickerFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/datepicker/datepicker.config';

test.describe('Datepicker Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/datepicker');
  });

  testForm(datepickerFormConfig);
});
