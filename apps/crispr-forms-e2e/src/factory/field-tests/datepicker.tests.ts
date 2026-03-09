import { test, expect } from '../../fixtures/angular-test';
import { DatepickerFieldConfig } from '@tft/crispr-forms/utils';
import { Validators } from '@angular/forms';
import { getLabel, getHint, getError, touchDatepicker } from '../../helpers/form.helpers';

export function testDatepickerField(config: DatepickerFieldConfig) {
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

  test('renders datepicker toggle button', async ({ page }) => {
    const toggle = page.locator(`[data-testid="${config.controlName}"] mat-datepicker-toggle`);
    await expect(toggle).toBeVisible();
  });

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when blurred without date', async ({ page }) => {
      await touchDatepicker(page, config.controlName);
      await expect(getError(page, config.controlName, 'datepicker')).toBeVisible();
    });
  }
}
