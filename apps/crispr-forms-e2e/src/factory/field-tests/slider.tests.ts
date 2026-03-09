import { test, expect } from '../../fixtures/angular-test';
import { SliderFieldConfig } from '@tft/crispr-forms/utils';

export function testSliderField(config: SliderFieldConfig) {
  test('renders slider', async ({ page }) => {
    const slider = page.locator(`[data-testid="${config.controlName}"]`);
    await expect(slider).toBeVisible();
  });

  if (config.label) {
    test('renders label', async ({ page }) => {
      // Slider uses a plain <label> not mat-label
      const sliderHost = page.locator(`crispr-slider-field:has([data-testid="${config.controlName}"])`);
      await expect(sliderHost.locator('label')).toContainText(config.label);
    });
  }

  if (config.min !== undefined) {
    test(`has correct min value (${config.min})`, async ({ page }) => {
      const slider = page.locator(`[data-testid="${config.controlName}"]`);
      await expect(slider).toHaveAttribute('min', String(config.min));
    });
  }

  if (config.max !== undefined) {
    test(`has correct max value (${config.max})`, async ({ page }) => {
      const slider = page.locator(`[data-testid="${config.controlName}"]`);
      await expect(slider).toHaveAttribute('max', String(config.max));
    });
  }
}
