import { test, expect } from '@playwright/test';
import type { AutocompleteFieldConfig } from '@tft/crispr-forms/utils';
import { Validators } from '@angular/forms';
import { getLabel, getHint, getError, getAutocompleteInput, submitForm } from '../helpers/form.helpers';

/**
 * Registers Playwright tests for an AUTOCOMPLETE field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 *
 * Note: errors are triggered via `submitForm()` rather than blur because the
 * autocomplete uses a hidden `[formControlName]` anchor for validation — blurring
 * the visible input does not touch the hidden control. `submitForm()` fires
 * `ControlErrorsFormDirective.submit$` which forces all controls to show errors.
 */
export function testAutocompleteField(config: AutocompleteFieldConfig) {
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

  test('shows dropdown options when typing', async ({ page }) => {
    await getAutocompleteInput(page, config.controlName).fill('Option');
    const options = page.locator('mat-option');
    await expect(options.first()).toBeVisible();
  });

  test('can select an autocomplete option', async ({ page }) => {
    await getAutocompleteInput(page, config.controlName).fill('Option A');
    await page.locator('mat-option').filter({ hasText: 'Option A' }).click();
    await expect(getAutocompleteInput(page, config.controlName)).toHaveValue('Option A');
  });

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when form submitted empty', async ({ page }) => {
      await getAutocompleteInput(page, config.controlName).fill('');
      await submitForm(page);
      await expect(getError(page, config.controlName, 'autocomplete')).toBeVisible();
    });
  }
}
