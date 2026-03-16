import { test, expect } from '@playwright/test';
import type { CheckboxFieldConfig } from '@tft/crispr-forms/utils';
import { Validators } from '@angular/forms';
import { getCheckbox, getError } from '../helpers/form.helpers';

/**
 * Registers Playwright tests for a CHECKBOX field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 */
export function testCheckboxField(config: CheckboxFieldConfig) {
  test('renders label', async ({ page }) => {
    const label = getCheckbox(page, config.controlName).locator('.mdc-label');
    await expect(label).toContainText(config.label);
  });

  if (config.validators?.includes(Validators.requiredTrue)) {
    test('shows error when unchecked and blurred', async ({ page }) => {
      await getCheckbox(page, config.controlName).click();
      await getCheckbox(page, config.controlName).click();
      await page.keyboard.press('Tab');
      await expect(getError(page, config.controlName, 'checkbox')).toBeVisible();
    });

    test('no error when checked', async ({ page }) => {
      await getCheckbox(page, config.controlName).click();
      await page.keyboard.press('Tab');
      await expect(getError(page, config.controlName, 'checkbox')).not.toBeVisible();
    });
  }
}
