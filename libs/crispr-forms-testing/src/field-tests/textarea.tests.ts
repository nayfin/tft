import { test, expect } from '@playwright/test';
import { TextareaFieldConfig } from '@tft/crispr-forms/utils';
import { Validators } from '@angular/forms';
import { getMatFormField, getError, getLabel, getHint } from '../helpers/form.helpers';

/**
 * Registers Playwright tests for a TEXTAREA field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 */
export function testTextareaField(config: TextareaFieldConfig) {
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

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when blurred empty', async ({ page }) => {
      const textarea = getMatFormField(page, config.controlName).locator('textarea');
      await textarea.click();
      await page.keyboard.press('Tab');
      await expect(getError(page, config.controlName, 'textarea')).toBeVisible();
    });
  }
}
