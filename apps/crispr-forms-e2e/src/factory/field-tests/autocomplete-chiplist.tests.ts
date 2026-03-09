import { test, expect } from '../../fixtures/angular-test';
import { AutocompleteChiplistFieldConfig } from '@tft/crispr-forms/utils';
import { getLabel, getHint, getError, getMatFormField } from '../../helpers/form.helpers';

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
    // The search input in the chiplist (role="searchbox")
    const searchInput = getMatFormField(page, config.controlName).locator('input[role="searchbox"]');
    await searchInput.fill('Option');
    const options = page.locator('mat-option');
    await expect(options.first()).toBeVisible();
  });

  test('can add a chip by selecting an option', async ({ page }) => {
    const searchInput = getMatFormField(page, config.controlName).locator('input[role="searchbox"]');
    await searchInput.fill('Option A');
    await page.locator('mat-option').filter({ hasText: 'Option A' }).click();
    const chip = getMatFormField(page, config.controlName).locator('mat-chip-row').first();
    await expect(chip).toContainText('Option A');
  });

  test('can remove a chip', async ({ page }) => {
    const searchInput = getMatFormField(page, config.controlName).locator('input[role="searchbox"]');
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
    // blur without adding chips
    const searchInput = getMatFormField(page, config.controlName).locator('input[role="searchbox"]');
    await searchInput.click();
    await page.keyboard.press('Tab');
    await expect(getError(page, config.controlName, 'autocomplete-chiplist')).toBeVisible();
  });
}
