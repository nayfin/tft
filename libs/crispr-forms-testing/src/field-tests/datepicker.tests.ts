import { test, expect, type Page } from '@playwright/test';
import type { DatepickerFieldConfig } from '@tft/crispr-forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  getLabel,
  getHint,
  getError,
  getMatFormField,
  getInput,
  touchDatepicker,
  enterDatepickerDate,
  getDatepickerClearButton,
  openDatepickerCalendar,
  closeDatepickerCalendar,
  getCalendarDayClasses,
} from '../helpers/form.helpers';

/** A fixed month, so the expected cell classes never depend on today's date. */
const calendarYear = 2024;
const calendarMonth = 0; // January
const daysInMonth = 31;

/** Normalizes the `MatCalendarCellCssClasses` a cell class function may return into a list of class names. */
function toClassList(classes: unknown): string[] {
  if (!classes) return [];
  if (typeof classes === 'string') return classes.split(/\s+/).filter(Boolean);
  if (Array.isArray(classes) || classes instanceof Set) return [...classes].filter(Boolean);
  return Object.entries(classes as Record<string, unknown>).filter(([, on]) => on).map(([name]) => name);
}

/**
 * A group whose controls are created empty on first access, so a `dateClass` that reads sibling controls can be
 * evaluated in Node. A sibling that is empty in the page is empty here too, which keeps the two in step.
 */
function createLenientGroup(): FormGroup {
  const group = new FormGroup({});
  const get = group.get.bind(group);
  group.get = ((path: string) => {
    if (!get(path)) group.addControl(path, new FormControl(null));
    return get(path);
  }) as FormGroup['get'];
  return group;
}

/**
 * Enters 1/15/2024, opens the calendar and compares every day of the month with the classes the config says it
 * must carry. A day has a class exactly when the config returns it, and at least one day must have one.
 */
async function expectCalendarClasses(
  page: Page,
  controlName: string,
  cellClasses: (date: Date, view: 'month') => unknown,
) {
  await enterDatepickerDate(page, controlName, '1/15/2024');
  await openDatepickerCalendar(page, controlName);
  const domDays = await getCalendarDayClasses(page);

  const expected = Array.from({ length: daysInMonth }, (_, i) => toClassList(cellClasses(new Date(calendarYear, calendarMonth, i + 1), 'month')));
  const allClasses = new Set(expected.flat());
  expect(allClasses.size, 'the config must highlight at least one day').toBeGreaterThan(0);
  expect(Object.keys(domDays).length, 'the calendar must render every day of the month').toBe(daysInMonth);

  let highlighted = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    for (const className of allClasses) {
      const shouldHave = expected[day - 1].includes(className);
      if (shouldHave) highlighted++;
      expect(domDays[day].includes(className), `day ${day} ${shouldHave ? 'has' : 'does not have'} class "${className}"`).toBe(shouldHave);
    }
  }
  expect(highlighted).toBeGreaterThan(0);
  await closeDatepickerCalendar(page);
}

/**
 * Registers Playwright tests for a DATEPICKER field config.
 * Call inside a `test.describe` block that has already navigated to the page.
 */
export function testDatepickerField(config: DatepickerFieldConfig) {
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

  test('renders datepicker toggle button', async ({ page }) => {
    const toggle = getMatFormField(page, config.controlName).locator('mat-datepicker-toggle');
    await expect(toggle).toBeVisible();
  });

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when blurred without date', async ({ page }) => {
      await touchDatepicker(page, config.controlName);
      await expect(getError(page, config.controlName, 'datepicker')).toBeVisible();
    });
  }

  if (config.clearable) {
    const label = config.clearButtonLabel ?? 'Clear date';

    test('hides clear button when empty', async ({ page }) => {
      await expect(getDatepickerClearButton(page, config.controlName)).toHaveCount(0);
    });

    test('shows clear button with its accessible label once a date is entered', async ({ page }) => {
      await enterDatepickerDate(page, config.controlName, '1/15/2024');
      const clearButton = getDatepickerClearButton(page, config.controlName);
      await expect(clearButton).toBeVisible();
      await expect(clearButton).toHaveAttribute('aria-label', label);
    });

    test('clear button empties the input and hides itself', async ({ page }) => {
      await enterDatepickerDate(page, config.controlName, '1/15/2024');
      await expect(getInput(page, config.controlName)).toHaveValue(/2024/);

      await getDatepickerClearButton(page, config.controlName).click();

      await expect(getInput(page, config.controlName)).toHaveValue('');
      await expect(getDatepickerClearButton(page, config.controlName)).toHaveCount(0);
    });

    if (config.validators?.includes(Validators.required)) {
      test('shows required error after clearing the date', async ({ page }) => {
        await enterDatepickerDate(page, config.controlName, '1/15/2024');
        await expect(getError(page, config.controlName, 'datepicker')).toHaveCount(0);

        await getDatepickerClearButton(page, config.controlName).click();

        await expect(getError(page, config.controlName, 'datepicker')).toBeVisible();
      });
    }
  }

  if (config.cellClassFunction) {
    const cellClassFunction = config.cellClassFunction;
    test('applies the cellClassFunction classes to the calendar days', async ({ page }) => {
      await expectCalendarClasses(page, config.controlName, cellClassFunction);
    });
  }

  // `cellClassFunction` takes precedence over `dateClass` when both are set, so only check `dateClass` without it.
  if (config.dateClass && !config.cellClassFunction) {
    const dateClass = config.dateClass;
    test('applies the dateClass classes to the calendar days', async ({ page }) => {
      const cellClasses = await firstValueFrom(dateClass(createLenientGroup()));
      await expectCalendarClasses(page, config.controlName, cellClasses);
    });
  }
}
