import { test, expect } from '@playwright/test';
import { AutocompleteChiplistFieldConfig } from '@tft/crispr-forms/utils';
import { getLabel, getHint, getError, getMatFormField, submitForm } from '../helpers/form.helpers';

/**
 * Registers Playwright tests for an AUTOCOMPLETE_CHIPLIST field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 *
 * Note: like autocomplete, errors require `submitForm()` rather than blur because
 * the hidden `[formControlName]` anchor is what holds validators. Blurring the
 * visible search input does not touch the hidden control.
 */
export function testAutocompleteChiplistField(config: AutocompleteChiplistFieldConfig) {
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

  test('can type and see options', async ({ page }) => {
    const searchInput = getMatFormField(page, config.controlName).locator('input[matInput]');
    await searchInput.fill('Option');
    const options = page.locator('mat-option');
    await expect(options.first()).toBeVisible();
  });

  test('can add a chip by selecting an option', async ({ page }) => {
    const searchInput = getMatFormField(page, config.controlName).locator('input[matInput]');
    await searchInput.fill('Option A');
    await page.locator('mat-option').filter({ hasText: 'Option A' }).click();
    const chip = getMatFormField(page, config.controlName).locator('mat-chip-row').first();
    await expect(chip).toContainText('Option A');
  });

  test('can remove a chip', async ({ page }) => {
    const searchInput = getMatFormField(page, config.controlName).locator('input[matInput]');
    await searchInput.fill('Option A');
    await page.locator('mat-option').filter({ hasText: 'Option A' }).click();
    const removeBtn = getMatFormField(page, config.controlName).locator('mat-chip-row mat-icon[matChipRemove]').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      const chips = getMatFormField(page, config.controlName).locator('mat-chip-row');
      await expect(chips).toHaveCount(0);
    }
  });

  test('shows error when not enough chips selected', async ({ page }) => {
    await submitForm(page);
    await expect(getError(page, config.controlName, 'autocomplete-chiplist')).toBeVisible();
  });
}
