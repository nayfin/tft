import { test, expect } from '@playwright/test';
import type { DatepickerFieldConfig } from '@tft/crispr-forms';
import { Validators } from '@angular/forms';
import {
  getLabel,
  getHint,
  getError,
  getMatFormField,
  getInput,
  touchDatepicker,
  enterDatepickerDate,
  getDatepickerClearButton,
} from '../helpers/form.helpers';

/**
 * Registers Playwright tests for a DATEPICKER field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 */
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
    const toggle = getMatFormField(page, config.controlName).locator('mat-datepicker-toggle');
    await expect(toggle).toBeVisible();
  });

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when blurred without date', async ({ page }) => {
      await touchDatepicker(page, config.controlName);
      await expect(getError(page, config.controlName, 'datepicker')).toBeVisible();
    });
  }

  if (config.clearable) {
    const label = config.clearButtonLabel ?? 'Clear date';

    test('hides clear button when empty', async ({ page }) => {
      await expect(getDatepickerClearButton(page, config.controlName)).toHaveCount(0);
    });

    test('shows clear button with its accessible label once a date is entered', async ({ page }) => {
      await enterDatepickerDate(page, config.controlName, '1/15/2024');
      const clearButton = getDatepickerClearButton(page, config.controlName);
      await expect(clearButton).toBeVisible();
      await expect(clearButton).toHaveAttribute('aria-label', label);
    });

    test('clear button empties the input and hides itself', async ({ page }) => {
      await enterDatepickerDate(page, config.controlName, '1/15/2024');
      await expect(getInput(page, config.controlName)).toHaveValue(/2024/);

      await getDatepickerClearButton(page, config.controlName).click();

      await expect(getInput(page, config.controlName)).toHaveValue('');
      await expect(getDatepickerClearButton(page, config.controlName)).toHaveCount(0);
    });

    if (config.validators?.includes(Validators.required)) {
      test('shows required error after clearing the date', async ({ page }) => {
        await enterDatepickerDate(page, config.controlName, '1/15/2024');
        await expect(getError(page, config.controlName, 'datepicker')).toHaveCount(0);

        await getDatepickerClearButton(page, config.controlName).click();

        await expect(getError(page, config.controlName, 'datepicker')).toBeVisible();
      });
    }
  }
}
