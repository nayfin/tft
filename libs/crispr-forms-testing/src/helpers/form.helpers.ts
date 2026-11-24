import { Page, Locator, expect } from '@playwright/test';

/**
 * Returns the locator for a field's root element (the element with `data-testid`).
 * For most fields this is a `mat-form-field`; for checkbox/slider it is the control element.
 *
 * For nested fields, pass the full hierarchical testId path:
 * - subGroup child: `'address.city'`
 * - formGroupList item child: `'contacts[0].email'`
 */
export function getMatFormField(page: Page, testId: string): Locator {
  return page.locator(`[data-testid="${testId}"]`);
}

/**
 * Returns the `<input>` inside a field. Works for INPUT, DATEPICKER, and other fields
 * that render a single native input.
 */
export function getInput(page: Page, testId: string): Locator {
  return getMatFormField(page, testId).locator('input');
}

/**
 * Returns the validation error paragraph for a field.
 *
 * Targets the inner `<p class="tft-control-error">` rather than the host element to
 * avoid Playwright strict-mode failures on fields like autocomplete/chiplist that
 * render two `tft-control-error` host elements (one for each internal input).
 *
 * @param fieldType - The kebab-case field type used in the component selector,
 *   e.g. `'input'`, `'select'`, `'autocomplete'`, `'autocomplete-chiplist'`,
 *   `'checkbox'`, `'datepicker'`, `'textarea'`, `'slider'`. Defaults to `'input'`.
 */
export function getError(page: Page, testId: string, fieldType = 'input'): Locator {
  return page.locator(`crispr-${fieldType}-field:has([data-testid="${testId}"]) p.tft-control-error`);
}

/**
 * Returns the `<mat-label>` element inside a field's form field.
 */
export function getLabel(page: Page, testId: string): Locator {
  return getMatFormField(page, testId).locator('mat-label');
}

/**
 * Returns the `<mat-hint>` element inside a field's form field.
 */
export function getHint(page: Page, testId: string): Locator {
  return getMatFormField(page, testId).locator('mat-hint');
}

/**
 * Clicks an input and presses Tab to trigger a real blur event.
 * Angular's touched state is driven by blur, not just focus-out.
 */
export async function touchInput(page: Page, testId: string): Promise<void> {
  await getInput(page, testId).click();
  await page.keyboard.press('Tab');
}

/** Returns the `<mat-select>` element inside a select field. */
export function getMatSelect(page: Page, testId: string): Locator {
  return getMatFormField(page, testId).locator('mat-select');
}

/** Opens a `mat-select` dropdown. */
export async function openSelect(page: Page, testId: string): Promise<void> {
  await getMatSelect(page, testId).click();
}

/** Opens a `mat-select`, clicks the option with the given label, and waits for it to close. */
export async function selectOption(page: Page, testId: string, optionLabel: string): Promise<void> {
  await openSelect(page, testId);
  await page.locator('mat-option').filter({ hasText: optionLabel }).click();
}

/**
 * Opens a `mat-select`, presses Escape, then Tab to blur it.
 * The extra Tab is required — Escape alone dismisses the panel but does not blur
 * the trigger element, so `ControlErrorsDirective` never sees a blur event.
 */
export async function touchSelect(page: Page, testId: string): Promise<void> {
  await openSelect(page, testId);
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
}

/** Returns the `<mat-checkbox>` element for a checkbox field. */
export function getCheckbox(page: Page, testId: string): Locator {
  return page.locator(`[data-testid="${testId}"]`);
}

/**
 * Clicks a checkbox twice (check then uncheck) and presses Tab to blur,
 * leaving it unchecked and touched — useful for triggering `requiredTrue` errors.
 */
export async function touchCheckbox(page: Page, testId: string): Promise<void> {
  await getCheckbox(page, testId).click();
  await getCheckbox(page, testId).click();
  await page.keyboard.press('Tab');
}

/**
 * Returns the visible search input for an autocomplete field.
 * Note: this is the `role="textbox"` input, NOT the hidden `[formControlName]` anchor.
 */
export function getAutocompleteInput(page: Page, testId: string): Locator {
  return getMatFormField(page, testId).locator('input[type="textbox"]');
}

/** Clicks the autocomplete input and presses Tab to blur. */
export async function touchAutocomplete(page: Page, testId: string): Promise<void> {
  await getAutocompleteInput(page, testId).click();
  await page.keyboard.press('Tab');
}

/**
 * Programmatically clicks the hidden crispr-form submit button.
 *
 * This fires both the native `submit` event (required by `ControlErrorsFormDirective`
 * to show errors on untouched controls) and Angular's `ngSubmit` event.
 *
 * Must use `evaluate` + native `.click()` because `display:none` elements
 * have no layout position for Playwright pointer events.
 *
 * @param nth - Zero-based index of the form on the page. Defaults to `0`.
 */
export async function submitForm(page: Page, nth = 0): Promise<void> {
  await page.evaluate((n) => {
    const triggers = document.querySelectorAll<HTMLButtonElement>('[data-testid="submit-trigger"]');
    triggers[n]?.click();
  }, nth);
}

/** Clicks the datepicker input and presses Tab to blur. */
export async function touchDatepicker(page: Page, testId: string): Promise<void> {
  await getMatFormField(page, testId).locator('input').click();
  await page.keyboard.press('Tab');
}

/**
 * Types a date into a datepicker's input (e.g. `'1/15/2024'` for the en-US locale) and presses Tab to blur it.
 * The datepicker parses the text into the control value as it is typed.
 */
export async function enterDatepickerDate(page: Page, testId: string, text: string): Promise<void> {
  const input = getMatFormField(page, testId).locator('input');
  await input.click();
  await input.fill(text);
  await page.keyboard.press('Tab');
}

/** Returns the clear button of a `clearable` datepicker field. It is only rendered while the control has a value. */
export function getDatepickerClearButton(page: Page, testId: string): Locator {
  return page.locator(`[data-testid="${testId}-clear"]`);
}

/** Opens a datepicker's calendar with its toggle button. */
export async function openDatepickerCalendar(page: Page, testId: string): Promise<void> {
  await getMatFormField(page, testId).locator('mat-datepicker-toggle button').click();
  await page.locator('mat-calendar').waitFor({ state: 'visible' });
  // The calendar moves focus to its active day once it has opened. Escape only closes it from there.
  await expect(page.locator('mat-calendar button.mat-calendar-body-active')).toBeFocused();
}

/** Closes the open datepicker calendar with Escape and waits until it is gone. */
export async function closeDatepickerCalendar(page: Page): Promise<void> {
  // Escape is retried because the datepicker ignores it while its opening animation is still running.
  await expect(async () => {
    await page.keyboard.press('Escape');
    await expect(page.locator('mat-calendar')).toHaveCount(0, { timeout: 1000 });
  }).toPass({ timeout: 10000 });
}

/**
 * Reads the day cells of the open calendar's month view.
 * Returns the CSS classes of each cell's `button.mat-calendar-body-cell` keyed by its day number,
 * which is matched on the whole text of `.mat-calendar-body-cell-content` (so day 1 is never confused with 10 to 19).
 */
export async function getCalendarDayClasses(page: Page): Promise<Record<number, string[]>> {
  return page.locator('mat-calendar button.mat-calendar-body-cell').evaluateAll((cells) => {
    const days: Record<number, string[]> = {};
    for (const cell of cells) {
      const text = cell.querySelector('.mat-calendar-body-cell-content')?.textContent?.trim() ?? '';
      if (/^\d+$/.test(text)) {
        days[Number(text)] = Array.from(cell.classList);
      }
    }
    return days;
  });
}
