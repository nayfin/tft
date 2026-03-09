import { test } from '../../fixtures/angular-test';
import { sliderFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/slider/slider.config';
import { testField } from '../../factory/field-test-factory';
import { ControlType } from '@tft/crispr-forms/utils';

const controlFields = sliderFormConfig.fields.filter((f) => f.controlType !== ControlType.BUTTON);

test.describe('Slider Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/slider');
  });

  for (const field of controlFields) {
    testField(field);
  }
});
