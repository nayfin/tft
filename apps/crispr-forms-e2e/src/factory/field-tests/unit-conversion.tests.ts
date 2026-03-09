import { test, expect } from '../../fixtures/angular-test';
import { UnitConversionFieldConfig } from '@tft/crispr-forms/utils';
import { Validators } from '@angular/forms';
import { getLabel, getMatFormField, getError } from '../../helpers/form.helpers';

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
      // The unit select is a sibling mat-form-field within the same crispr-unit-conversion-field
      const unitSelect = page.locator(`crispr-unit-conversion-field:has([data-testid="${config.controlName}"]) .unit-field mat-select`);
      await expect(unitSelect).toBeVisible();
    });
  }

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when blurred empty', async ({ page }) => {
      const numberInput = getMatFormField(page, config.controlName).locator('input[type="number"]');
      await numberInput.click();
      await page.keyboard.press('Tab');
      await expect(getError(page, config.controlName, 'unit-conversion')).toBeVisible();
    });
  }
}
