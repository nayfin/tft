import { test, expect } from '@playwright/test';
import { boxDelta, getBox, resizeBy } from '@tft/interact-testing';
import { expectNear, toNumber, expectBoxNear } from '../../support';

test.describe('Resize basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interact-demo/features/resize/basics');
  });

  test('dragging the right edge changes the width by the pointer delta', async ({
    page,
  }) => {
    const box = page.getByTestId('resize-box');
    const before = await getBox(box);

    await resizeBy(page, box, 'right', 60, 0);

    const delta = boxDelta(before, await getBox(box));
    expectNear(delta.width, 60);
    expectNear(delta.height, 0);
    // Resizing from the right does not move the element
    expectNear(delta.x, 0);
    expectNear(delta.y, 0);
    await expect(page.getByTestId('resize-event')).toHaveText('resizeEnd');
    expectNear(
      toNumber(await page.getByTestId('resize-width').textContent()),
      260
    );
    expectNear(
      toNumber(await page.getByTestId('resize-height').textContent()),
      120
    );
  });

  test('dragging the bottom edge changes the height by the pointer delta', async ({
    page,
  }) => {
    const box = page.getByTestId('resize-box');
    const before = await getBox(box);

    await resizeBy(page, box, 'bottom', 0, 40);

    const delta = boxDelta(before, await getBox(box));
    expectNear(delta.width, 0);
    expectNear(delta.height, 40);
    expectNear(
      toNumber(await page.getByTestId('resize-width').textContent()),
      200
    );
    expectNear(
      toNumber(await page.getByTestId('resize-height').textContent()),
      160
    );
  });

  test('dragging the corner changes the width and the height', async ({
    page,
  }) => {
    const box = page.getByTestId('resize-box');
    const before = await getBox(box);

    await resizeBy(page, box, 'bottom-right', 70, 30);

    const delta = boxDelta(before, await getBox(box));
    expectNear(delta.width, 70);
    expectNear(delta.height, 30);
    expectNear(
      toNumber(await page.getByTestId('resize-width').textContent()),
      270
    );
    expectNear(
      toNumber(await page.getByTestId('resize-height').textContent()),
      150
    );
  });

  test('shrinking works too', async ({ page }) => {
    const box = page.getByTestId('resize-box');
    const before = await getBox(box);

    await resizeBy(page, box, 'bottom-right', -50, -20);

    const delta = boxDelta(before, await getBox(box));
    expectNear(delta.width, -50);
    expectNear(delta.height, -20);
  });

  test('an edge that is not enabled does not resize', async ({ page }) => {
    const box = page.getByTestId('resize-box');
    const before = await getBox(box);

    // Only the right and bottom edges are enabled in the resizeConfig
    await resizeBy(page, box, 'left', -40, 0);

    expectBoxNear(await getBox(box), before);
    await expect(page.getByTestId('resize-event')).toHaveText('none');
  });

  test('the size does not change while resizeDisabled is on, and changes again once it is off', async ({
    page,
  }) => {
    const box = page.getByTestId('resize-box');
    const before = await getBox(box);

    await page.getByTestId('resize-toggle-disabled').click();
    await expect(page.getByTestId('resize-disabled')).toHaveText('true');
    await resizeBy(page, box, 'bottom-right', 60, 30);

    expectBoxNear(await getBox(box), before);
    await expect(page.getByTestId('resize-event')).toHaveText('none');

    await page.getByTestId('resize-toggle-disabled').click();
    await expect(page.getByTestId('resize-disabled')).toHaveText('false');
    await resizeBy(page, box, 'bottom-right', 60, 30);

    const delta = boxDelta(before, await getBox(box));
    expectNear(delta.width, 60);
    expectNear(delta.height, 30);
  });
});
