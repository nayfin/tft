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
});
