import { test, expect } from '@playwright/test';
import { FileUploadFieldConfig } from '@tft/crispr-forms/utils';
import { getLabel, getMatFormField } from '../helpers/form.helpers';

/**
 * Registers Playwright tests for a FILE_UPLOAD field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 */
export function testFileUploadField(config: FileUploadFieldConfig) {
  if (config.label) {
    test('renders label', async ({ page }) => {
      await expect(getLabel(page, config.controlName)).toHaveText(config.label);
    });
  }

  test('shows drop zone text', async ({ page }) => {
    if (config.dropZoneText) {
      const dropZone = getMatFormField(page, config.controlName).locator('.drop-info');
      await expect(dropZone).toContainText(config.dropZoneText);
    }
  });

  test('shows select files button', async ({ page }) => {
    const button = getMatFormField(page, config.controlName).locator('button');
    await expect(button).toBeVisible();
    if (config.selectButtonText) {
      await expect(button).toContainText(config.selectButtonText);
    }
  });
}
