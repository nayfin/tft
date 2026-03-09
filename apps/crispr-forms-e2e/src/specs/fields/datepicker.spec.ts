import { test } from '../../fixtures/angular-test';
import { datepickerFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/datepicker/datepicker.config';
import { testField } from '../../factory/field-test-factory';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = datepickerFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Datepicker Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/datepicker');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
