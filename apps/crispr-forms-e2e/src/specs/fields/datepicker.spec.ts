import type { Page } from '@playwright/test';
import {
  test,
  expect,
  testForm,
  getInput,
  enterDatepickerDate,
  openDatepickerCalendar,
  closeDatepickerCalendar,
  getCalendarDayClasses,
} from '@tft/crispr-forms-testing';
import {
  datepickerFormConfig,
  defaultHighlightDay,
} from '../../../../../apps/documentation/src/app/crispr-forms-demo/fields/datepicker/datepicker.config';

test.describe('Datepicker Field', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crispr-forms-demo/fields/datepicker');
  });

  testForm(datepickerFormConfig);

  test('dateClass follows the sibling control it observes', async ({ page }) => {
    const highlightedDays = async () => {
      await openDatepickerCalendar(page, 'testDateClassObservable');
      const days = await getCalendarDayClasses(page);
      await closeDatepickerCalendar(page);
      return Object.entries(days)
        .filter(([, classes]) => classes.includes('highlight-day'))
        .map(([day]) => Number(day));
    };

    await enterDatepickerDate(page, 'testDateClassObservable', '1/15/2024');

    // Before the sibling has a value, the observable's initial emission is in effect.
    expect(await highlightedDays()).toEqual([defaultHighlightDay]);

    await getInput(page, 'highlightDay').fill('5');
    expect(await highlightedDays()).toEqual([5]);

    await getInput(page, 'highlightDay').fill('12');
    expect(await highlightedDays()).toEqual([12]);
  });

  // The footer is the demo's `datepickerActions` component. Its Cancel and Select buttons only work when that
  // component imports the Material `matDatepickerCancel` and `matDatepickerApply` directives.
  test.describe('datepickerActions footer', () => {
    // The field's `startAt` is April 2019, so its calendar opens on that month.
    const pickApril10 = async (page: Page) => {
      await openDatepickerCalendar(page, 'customFooterDatepicker');
      await page.locator('mat-calendar button.mat-calendar-body-cell[aria-label="Apr 10, 2019"]').click();
    };

    test('Cancel closes the calendar without selecting the date', async ({ page }) => {
      await pickApril10(page);
      await page.getByRole('button', { name: 'CANCEL' }).click();

      await expect(page.locator('mat-calendar')).toHaveCount(0);
      await expect(getInput(page, 'customFooterDatepicker')).toHaveValue('');
    });

    test('Select closes the calendar and applies the date', async ({ page }) => {
      await pickApril10(page);
      await page.getByRole('button', { name: 'SELECT' }).click();

      await expect(page.locator('mat-calendar')).toHaveCount(0);
      await expect(getInput(page, 'customFooterDatepicker')).toHaveValue('04/10/2019');
    });
  });
});
