import { test, expect } from '@tft/crispr-forms-testing';

test.describe('Button Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/button');
  });

  test('renders data-testid from the testId config on a top-level button', async ({
    page,
  }) => {
    const button = page.locator('[data-testid="save-button"]');
    await expect(button).toHaveCount(1);
    await expect(button).toBeVisible();
    expect(await button.evaluate((el) => el.tagName)).toBe('BUTTON');
    await expect(button).toContainText('SAVE');
  });

  test('prefixes the testId with the sub group control name', async ({
    page,
  }) => {
    const button = page.locator('[data-testid="actions.sub-save-button"]');
    await expect(button).toHaveCount(1);
    await expect(button).toBeVisible();
    expect(await button.evaluate((el) => el.tagName)).toBe('BUTTON');
    // the unprefixed id must not exist
    await expect(page.locator('[data-testid="sub-save-button"]')).toHaveCount(
      0
    );
  });
});
