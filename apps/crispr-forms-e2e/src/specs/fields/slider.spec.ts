import { test, testForm } from '@tft/crispr-forms-testing';
// eslint-disable-next-line @nx/enforce-module-boundaries -- the spec shares the demo FormConfig with the documentation app, which implements the page under test
import { sliderFormConfig } from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/slider/slider.config';

test.describe('Slider Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/slider');
  });

  testForm(sliderFormConfig);
});
