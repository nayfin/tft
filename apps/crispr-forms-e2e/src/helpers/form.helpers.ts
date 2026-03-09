import { Page, Locator } from '@playwright/test';

export function getMatFormField(page: Page, controlName: string): Locator {
  return page.locator(`[data-testid="${controlName}"]`);
}

export function getInput(page: Page, controlName: string): Locator {
  return getMatFormField(page, controlName).locator('input');
}

export function getError(page: Page, controlName: string, fieldType = 'input'): Locator {
  // tft-control-error is inserted outside mat-form-field due to content projection,
  // but stays within the crispr-*-field component boundary
  return page.locator(`crispr-${fieldType}-field:has([data-testid="${controlName}"]) tft-control-error`);
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

// Select field helpers
export function getMatSelect(page: Page, controlName: string): Locator {
  return getMatFormField(page, controlName).locator('mat-select');
}

export async function openSelect(page: Page, controlName: string): Promise<void> {
  await getMatSelect(page, controlName).click();
}

export async function selectOption(page: Page, controlName: string, optionLabel: string): Promise<void> {
  await openSelect(page, controlName);
  await page.locator('mat-option').filter({ hasText: optionLabel }).click();
}

export async function touchSelect(page: Page, controlName: string): Promise<void> {
  await openSelect(page, controlName);
  await page.keyboard.press('Escape');
}

// Checkbox helpers
export function getCheckbox(page: Page, controlName: string): Locator {
  return page.locator(`[data-testid="${controlName}"]`);
}

export async function touchCheckbox(page: Page, controlName: string): Promise<void> {
  await getCheckbox(page, controlName).click();
  await getCheckbox(page, controlName).click(); // uncheck so requiredTrue fails
  await page.keyboard.press('Tab');
}

// Autocomplete helpers
export function getAutocompleteInput(page: Page, controlName: string): Locator {
  // The visible search input in autocomplete (type="textbox"), not the hidden form control
  return getMatFormField(page, controlName).locator('input[type="textbox"]');
}

export async function touchAutocomplete(page: Page, controlName: string): Promise<void> {
  await getAutocompleteInput(page, controlName).click();
  await page.keyboard.press('Tab');
}

// Datepicker helpers
export async function touchDatepicker(page: Page, controlName: string): Promise<void> {
  await getMatFormField(page, controlName).locator('input').click();
  await page.keyboard.press('Tab');
}
