import { test, expect } from '@playwright/test';
import {
  boxDelta,
  centerOf,
  getBox,
  offset,
  startDrag,
} from '@tft/interact-testing';
import { expectNear } from '../../support';

test.describe('Drag preview and placeholder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interact-demo/features/drag/placeholder-template');
  });

  test.describe('showPlaceholder off', () => {
    test('the source is hidden while dragging and visible again after the drop', async ({
      page,
    }) => {
      const item = page.getByTestId('hidden-zone').getByTestId('hidden-item');
      await expect(item).toBeVisible();

      const from = centerOf(await getBox(item));
      const drag = await startDrag(page, from);
      await drag.moveTo(offset(from, 90, 40));
      await expect(item).toBeHidden();

      await drag.drop();
      await expect(item).toBeVisible();
    });

    test('the preview template is in the drag root during the drag and removed after it', async ({
      page,
    }) => {
      const item = page.getByTestId('hidden-zone').getByTestId('hidden-item');
      // The preview is added to the drag root, which is the stage, next to the dropzone
      const preview = page
        .getByTestId('hidden-stage')
        .locator(':scope > [data-testid="hidden-preview"]');
      await expect(preview).toHaveCount(0);

      const from = centerOf(await getBox(item));
      const drag = await startDrag(page, from);
      await drag.moveTo(offset(from, 90, 40));
      await expect(preview).toHaveCount(1);
      await expect(preview).toBeVisible();

      await drag.drop();
      await expect(preview).toHaveCount(0);
    });

    test('the preview shows the local image', async ({ page }) => {
      const item = page.getByTestId('hidden-zone').getByTestId('hidden-item');

      const from = centerOf(await getBox(item));
      const drag = await startDrag(page, from);
      await drag.moveTo(offset(from, 90, 40));

      const image = page.getByTestId('hidden-preview').locator('img');
      await expect(image).toHaveAttribute(
        'src',
        'assets/interact/drag-preview.svg'
      );
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth
          )
        )
        .toBeGreaterThan(0);

      await drag.drop();
    });

    test('the source ends up where it was dropped', async ({ page }) => {
      const item = page.getByTestId('hidden-zone').getByTestId('hidden-item');
      const before = await getBox(item);
      const from = centerOf(before);

      const drag = await startDrag(page, from);
      await drag.moveTo(offset(from, 90, 40));
      await drag.drop();

      const delta = boxDelta(before, await getBox(item));
      expectNear(delta.x, 90);
      expectNear(delta.y, 40);
      await expect(page.getByTestId('hidden-event')).toHaveText('dragEnd');
    });
  });

  test.describe('showPlaceholder on', () => {
    test('the source stays visible and in place while dragging', async ({
      page,
    }) => {
      const item = page.getByTestId('shown-zone').getByTestId('shown-item');
      const before = await getBox(item);
      const from = centerOf(before);

      const drag = await startDrag(page, from);
      await drag.moveTo(offset(from, 90, 40));

      await expect(item).toBeVisible();
      expect(await getBox(item)).toEqual(before);
      // The preview is the thing that moves
      const preview = page
        .getByTestId('shown-stage')
        .locator(':scope > [data-testid="shown-preview"]');
      await expect(preview).toBeVisible();
      expectNear((await getBox(preview)).x, before.x + 90);
      expectNear((await getBox(preview)).y, before.y + 40);

      await drag.drop();
      await expect(preview).toHaveCount(0);
    });
  });
});
