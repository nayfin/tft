import { test, expect } from '../../fixtures/angular-test';
import { UnitConversionFieldConfig } from '@tft/crispr-forms/utils';
import { getLabel, getMatFormField } from '../../helpers/form.helpers';

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

  // Note: required error display is not implemented for unit-conversion fields
  // (the displayValueControl is separate from the form control that has validators)
}
