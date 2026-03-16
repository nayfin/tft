import { test, expect } from '@playwright/test';
import { UnitConversionFieldConfig } from '@tft/crispr-forms/utils';
import { getLabel, getMatFormField } from '../helpers/form.helpers';

/**
 * Registers Playwright tests for a UNIT_CONVERSION field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 *
 * Note: required error display is not testable for this field type. The
 * `displayValueControl` (what the user types into) is separate from the
 * `[formControlName]` that holds validators, so validation errors are never
 * wired to the visible input.
 */
export function testUnitConversionField(config: UnitConversionFieldConfig) {
  if (config.label) {
    test('renders label', async ({ page }) => {
      await expect(getLabel(page, config.controlName)).toHaveText(config.label);
    });
  }

  test('renders number input', async ({ page }) => {
    const numberInput = getMatFormField(page, config.controlName).locator('input[type="number"]');
    await expect(numberInput).toBeVisible();
  });

  if (config.showUnitSelect) {
    test('renders unit select when showUnitSelect is true', async ({ page }) => {
      const unitSelect = page.locator(`crispr-unit-conversion-field:has([data-testid="${config.controlName}"]) .unit-field mat-select`);
      await expect(unitSelect).toBeVisible();
    });
  }
}
