import { Page, Locator } from '@playwright/test';

export function getMatFormField(page: Page, controlName: string): Locator {
  return page.locator(`[data-testid="${controlName}"]`);
}

export function getInput(page: Page, controlName: string): Locator {
  return getMatFormField(page, controlName).locator('input');
}

export function getError(page: Page, controlName: string, fieldType = 'input'): Locator {
  // Target the inner <p> inside tft-control-error (only rendered when error text is present).
  // This avoids strict-mode failures on fields like autocomplete that have two tft-control-error
  // host elements (one per form input) where only the relevant one has visible content.
  // TODO: can we be less rigid with this selector?  use getMatFormField like getLabel?
  return page.locator(`crispr-${fieldType}-field:has([data-testid="${controlName}"]) p.tft-control-error`);
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
  await page.keyboard.press('Tab'); // blur the select to trigger touched state
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

// Submit the nearest crispr-form — fires the hidden submit-trigger to trigger the form's submit event.
// Must use evaluate+native click because display:none elements have no layout position for pointer events.
export async function submitForm(page: Page, nth = 0): Promise<void> {
  await page.evaluate((n) => {
    const triggers = document.querySelectorAll<HTMLButtonElement>('[data-testid="submit-trigger"]');
    triggers[n]?.click();
  }, nth);
}

// Datepicker helpers
export async function touchDatepicker(page: Page, controlName: string): Promise<void> {
  await getMatFormField(page, controlName).locator('input').click();
  await page.keyboard.press('Tab');
}
