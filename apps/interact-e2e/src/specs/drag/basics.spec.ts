import { test, expect } from '@playwright/test';
import { boxDelta, dragBy, getBox } from '@tft/interact-testing';
import { expectNear, toNumber } from '../../support';

test.describe('Drag basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interact-demo/features/drag/basics');
  });

  test.describe('drag inside a dropzone', () => {
    test('moves the element by the pointer delta and keeps the position after drop', async ({
      page,
    }) => {
      const item = page.getByTestId('basic-item');
      const before = await getBox(item);

      await dragBy(page, item, 120, 60);

      const delta = boxDelta(before, await getBox(item));
      expectNear(delta.x, 120);
      expectNear(delta.y, 60);
      expect(delta.width).toBe(0);
      expect(delta.height).toBe(0);

      // The final position is written to the element's style and stays there
      await expect(item).toHaveCSS('left', '160px');
      await expect(item).toHaveCSS('top', '100px');
    });

    test('reports the events and the position through the readout', async ({
      page,
    }) => {
      await expect(page.getByTestId('basic-event')).toHaveText('none');
      await expect(page.getByTestId('basic-x')).toHaveText('40');

      await dragBy(page, page.getByTestId('basic-item'), 120, 60);

      await expect(page.getByTestId('basic-event')).toHaveText('dragEnd');
      expectNear(
        toNumber(await page.getByTestId('basic-x').textContent()),
        160
      );
      expectNear(
        toNumber(await page.getByTestId('basic-y').textContent()),
        100
      );
    });

    test('does not fire a click on the drag root after a drop', async ({
      page,
    }) => {
      const stage = page.getByTestId('basic-stage');
      await expect(page.getByTestId('basic-clicks')).toHaveText('0');

      await dragBy(page, page.getByTestId('basic-item'), 120, 60);
      await expect(page.getByTestId('basic-event')).toHaveText('dragEnd');
      await expect(page.getByTestId('basic-clicks')).toHaveText('0');

      // The counter does work: a real click on the stage is counted
      await stage.click({ position: { x: 440, y: 20 } });
      await expect(page.getByTestId('basic-clicks')).toHaveText('1');
    });
  });

  test.describe('drag from a handle (allowFrom)', () => {
    test('a drag that starts outside the handle does nothing', async ({
      page,
    }) => {
      const item = page.getByTestId('handle-zone').getByTestId('handle-item');
      const before = await getBox(item);

      // The centre of the element is its body, not the grip in the corner
      await dragBy(page, item, 120, 60);

      expect(await getBox(item)).toEqual(before);
      await expect(page.getByTestId('handle-event')).toHaveText('none');
      await expect(page.getByTestId('handle-x')).toHaveText('40');
    });

    test('a drag that starts on the handle moves the element', async ({
      page,
    }) => {
      const zone = page.getByTestId('handle-zone');
      const item = zone.getByTestId('handle-item');
      const before = await getBox(item);

      await dragBy(page, item, 120, 60, {
        grab: zone.getByTestId('handle-grip'),
      });

      const delta = boxDelta(before, await getBox(item));
      expectNear(delta.x, 120);
      expectNear(delta.y, 60);
      await expect(page.getByTestId('handle-event')).toHaveText('dragEnd');
    });
  });

  test.describe('dragDisabled', () => {
    test('the element does not move while dragging is disabled, and moves again once enabled', async ({
      page,
    }) => {
      const item = page.getByTestId('toggle-zone').getByTestId('toggle-item');
      const before = await getBox(item);

      await page.getByTestId('toggle-drag-disabled').click();
      await expect(page.getByTestId('toggle-disabled')).toHaveText('true');
      await dragBy(page, item, 120, 60);

      expect(await getBox(item)).toEqual(before);
      await expect(page.getByTestId('toggle-event')).toHaveText('none');

      await page.getByTestId('toggle-drag-disabled').click();
      await expect(page.getByTestId('toggle-disabled')).toHaveText('false');
      await dragBy(page, item, 120, 60);

      const delta = boxDelta(before, await getBox(item));
      expectNear(delta.x, 120);
      expectNear(delta.y, 60);
      await expect(page.getByTestId('toggle-event')).toHaveText('dragEnd');
    });
  });
});
