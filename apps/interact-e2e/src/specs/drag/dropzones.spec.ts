import { test, expect } from '@playwright/test';
import {
  boxDelta,
  dragBy,
  dragOnto,
  getBox,
  pointIn,
} from '@tft/interact-testing';
import { expectNear } from '../../support';

test.describe('Dropzones', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interact-demo/features/drag/dropzones');
  });

  test('dropping into the second zone fires dragEnter and dragDrop there, and dragLeave on the first', async ({
    page,
  }) => {
    const zoneA = page.getByTestId('zone-a');
    const zoneB = page.getByTestId('zone-b');

    await dragOnto(page, zoneA.getByTestId('dz-item'), zoneB);

    // dragEnter and dragDrop read the zone data (its name) from the event
    await expect(page.getByTestId('dz-log').getByRole('listitem')).toHaveText([
      'dragEnter Zone A', // the pointer starts inside zone A
      'dragLeave Zone A',
      'dragEnter Zone B',
      'dragDrop Zone B',
    ]);
    await expect(page.getByTestId('dz-last-event')).toHaveText(
      'dragDrop Zone B'
    );
  });

  test('the item is moved to the second zone at the position it was dropped', async ({
    page,
  }) => {
    const zoneA = page.getByTestId('zone-a');
    const zoneB = page.getByTestId('zone-b');

    await dragOnto(page, zoneA.getByTestId('dz-item'), zoneB);

    await expect(page.getByTestId('dz-count-a')).toHaveText('0');
    await expect(page.getByTestId('dz-count-b')).toHaveText('1');
    await expect(zoneA.getByTestId('dz-item')).toHaveCount(0);
    await expect(zoneB.getByTestId('dz-item')).toBeVisible();

    // The readout and the element agree on where the item is inside zone B
    const delta = boxDelta(
      await getBox(zoneB),
      await getBox(zoneB.getByTestId('dz-item'))
    );
    const [x, y] = (
      (await page.getByTestId('dz-drop-position').textContent()) ?? ''
    )
      .split(',')
      .map(Number);
    expectNear(x, delta.x);
    expectNear(y, delta.y);
  });

  test('the item can be dragged back to the first zone', async ({ page }) => {
    const zoneA = page.getByTestId('zone-a');
    const zoneB = page.getByTestId('zone-b');

    await dragOnto(page, zoneA.getByTestId('dz-item'), zoneB);
    await expect(page.getByTestId('dz-count-b')).toHaveText('1');
    await dragOnto(page, zoneB.getByTestId('dz-item'), zoneA);

    await expect(page.getByTestId('dz-count-a')).toHaveText('1');
    await expect(page.getByTestId('dz-count-b')).toHaveText('0');
    await expect(page.getByTestId('dz-last-event')).toHaveText(
      'dragDrop Zone A'
    );
  });

  test('dropping inside the same zone does not touch the other zone', async ({
    page,
  }) => {
    const zoneA = page.getByTestId('zone-a');
    const item = zoneA.getByTestId('dz-item');
    const before = await getBox(item);

    await dragBy(page, item, 50, 30);

    await expect(page.getByTestId('dz-log').getByRole('listitem')).toHaveText([
      'dragEnter Zone A',
      'dragDrop Zone A',
    ]);
    await expect(page.getByTestId('dz-count-a')).toHaveText('1');
    await expect(page.getByTestId('dz-count-b')).toHaveText('0');
    const delta = boxDelta(before, await getBox(item));
    expectNear(delta.x, 50);
    expectNear(delta.y, 30);
  });

  test('releasing outside every zone does not fire dragDrop', async ({
    page,
  }) => {
    const item = page.getByTestId('zone-a').getByTestId('dz-item');
    // The gap between the two zones is a stage area that belongs to neither
    const stage = await getBox(page.getByTestId('dz-stage'));
    const gap = pointIn(stage, { x: 0.5, y: 0.5 });
    const from = pointIn(await getBox(item), { x: 0.5, y: 0.5 });

    await dragBy(page, item, gap.x - from.x, gap.y - from.y);

    await expect(page.getByTestId('dz-log').getByRole('listitem')).toHaveText([
      'dragEnter Zone A',
      'dragLeave Zone A',
    ]);
    await expect(page.getByTestId('dz-count-a')).toHaveText('1');
    await expect(page.getByTestId('dz-count-b')).toHaveText('0');
  });
});
