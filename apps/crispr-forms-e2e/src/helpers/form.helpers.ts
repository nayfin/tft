import { Page, Locator } from '@playwright/test';

export function getMatFormField(page: Page, controlName: string): Locator {
  return page.locator(`[data-testid="${controlName}"]`);
}

export function getInput(page: Page, controlName: string): Locator {
  return getMatFormField(page, controlName).locator('input');
}

export function getError(page: Page, controlName: string): Locator {
  // tft-control-error is inserted outside mat-form-field due to content projection,
  // but stays within the crispr-input-field component boundary
  return page.locator(`crispr-input-field:has([data-testid="${controlName}"]) tft-control-error`);
}

export function getLabel(page: Page, controlName: string): Locator {
  return getMatFormField(page, controlName).locator('mat-label');
}

export function getHint(page: Page, controlName: string): Locator {
  return getMatFormField(page, controlName).locator('mat-hint');
}

// Press Tab to trigger a real blur event that Angular's touched state tracks
export async function touchInput(page: Page, controlName: string): Promise<void> {
  await getInput(page, controlName).click();
  await page.keyboard.press('Tab');
}
