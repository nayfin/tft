import { test } from '../../fixtures/angular-test';
import { checkboxFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/checkbox/checkbox.config';
import { testField } from '../../factory/field-test-factory';
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
