import { test, expect } from '../../fixtures/angular-test';
import { SelectFieldConfig } from '@tft/crispr-forms/utils';
import { Validators } from '@angular/forms';
import { getLabel, getHint, getError, getMatSelect, openSelect, selectOption, touchSelect } from '../../helpers/form.helpers';

export function testSelectField(config: SelectFieldConfig) {
  if (config.label) {
    test('renders label', async ({ page }) => {
      await expect(getLabel(page, config.controlName)).toHaveText(config.label);
    });
  }

  if (config.hint) {
    test('shows hint when untouched', async ({ page }) => {
      await expect(getHint(page, config.controlName)).toBeVisible();
    });
  }

  if (Array.isArray(config.options)) {
    test('shows all options when opened', async ({ page }) => {
      await openSelect(page, config.controlName);
      const options = page.locator('mat-option');
      await expect(options).toHaveCount(config.options.length);
      await page.keyboard.press('Escape');
    });

    test('can select an option', async ({ page }) => {
      const firstOption = (config.options as Array<{ label: string; value: unknown }>)[0];
      await selectOption(page, config.controlName, firstOption.label);
      await expect(getMatSelect(page, config.controlName)).toContainText(firstOption.label);
    });
  }

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when blurred without selection', async ({ page }) => {
      await touchSelect(page, config.controlName);
      await expect(getError(page, config.controlName, 'select')).toBeVisible();
    });
  }
}
