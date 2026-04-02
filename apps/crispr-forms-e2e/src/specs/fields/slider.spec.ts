import { test, testForm } from '@tft/crispr-forms-testing';
import { sliderFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/slider/slider.config';

test.describe('Slider Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/slider');
  });

  testForm(sliderFormConfig);
});
