import { test, expect } from '@playwright/test';
import { boxDelta, dragBy, getBox } from '@tft/interact-testing';
import { expectNear, toNumber } from '../../support';

test.describe('Scale basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interact-demo/features/scale/basics');
  });

  test('starts at scale 1.5, so one unit is 1.5 pixels on screen', async ({
    page,
  }) => {
    await expect(page.getByTestId('scale-value')).toHaveText('1.5');
    await expect(page.getByTestId('scale-stage')).toHaveCSS(
      'font-size',
      '1.5px'
    );
    // The item is 80 x 50 units
    const item = await getBox(
      page.getByTestId('scale-zone').getByTestId('scale-item')
    );
    expectNear(item.width, 120);
    expectNear(item.height, 75);
  });

  test('at scale 1.5 a 150px pointer move is a 100 unit position change', async ({
    page,
  }) => {
    const item = page.getByTestId('scale-zone').getByTestId('scale-item');
    const before = await getBox(item);
    await expect(page.getByTestId('scale-x')).toHaveText('40');

    await dragBy(page, item, 150, 0);

    // On screen the element moved with the pointer ...
    expectNear(boxDelta(before, await getBox(item)).x, 150);
    // ... and the units reported by the library changed by two thirds of that
    await expect(page.getByTestId('scale-event')).toHaveText('dragEnd');
    expectNear(toNumber(await page.getByTestId('scale-x').textContent()), 140);
    expectNear(toNumber(await page.getByTestId('scale-y').textContent()), 40);
  });

  test('changing the scale changes how pointer movement maps to units', async ({
    page,
  }) => {
    const item = page.getByTestId('scale-zone').getByTestId('scale-item');

    await page.getByTestId('scale-option-2').click();
    await expect(page.getByTestId('scale-value')).toHaveText('2');
    await expect(page.getByTestId('scale-stage')).toHaveCSS('font-size', '2px');

    const before = await getBox(item);
    await dragBy(page, item, 150, 0);

    expectNear(boxDelta(before, await getBox(item)).x, 150);
    expectNear(toNumber(await page.getByTestId('scale-x').textContent()), 115);
  });

  test('at scale 1 pointer pixels and units are the same', async ({ page }) => {
    const item = page.getByTestId('scale-zone').getByTestId('scale-item');

    await page.getByTestId('scale-option-1').click();
    await expect(page.getByTestId('scale-value')).toHaveText('1');

    await dragBy(page, item, 150, 0);

    expectNear(toNumber(await page.getByTestId('scale-x').textContent()), 190);
  });
});
