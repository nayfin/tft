import { test, expect } from '@playwright/test';
import type { SliderFieldConfig } from '@tft/crispr-forms/utils';

/**
 * Registers Playwright tests for a SLIDER field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 *
 * Note: slider uses a plain `<label>` (not `<mat-label>`) because it is not
 * rendered inside a `mat-form-field`. The `data-testid` is on the `<mat-slider>`
 * element itself.
 *
 * Note: `min`/`max` are read from the native HTML attributes on `input[matSliderThumb]`,
 * not from `aria-valuemin`/`aria-valuemax`.
 */
export function testSliderField(config: SliderFieldConfig) {
  test('renders slider', async ({ page }) => {
    const slider = page.locator(`[data-testid="${config.controlName}"]`);
    await expect(slider).toBeVisible();
  });

  if (config.label) {
    test('renders label', async ({ page }) => {
      const sliderHost = page.locator(`crispr-slider-field:has([data-testid="${config.controlName}"])`);
      await expect(sliderHost.locator('label')).toContainText(config.label);
    });
  }

  if (config.min !== undefined) {
    test(`has correct min value (${config.min})`, async ({ page }) => {
      const thumb = page.locator(`[data-testid="${config.controlName}"] input`);
      await expect(thumb).toHaveAttribute('min', String(config.min));
    });
  }

  if (config.max !== undefined) {
    test(`has correct max value (${config.max})`, async ({ page }) => {
      const thumb = page.locator(`[data-testid="${config.controlName}"] input`);
      await expect(thumb).toHaveAttribute('max', String(config.max));
    });
  }
}
