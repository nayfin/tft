import { test, expect, Page } from '@playwright/test';
import { Box, getBox, offset, startDrag } from '@tft/interact-testing';
import { expectNear, toNumber } from '../../support';

// The lasso moves by this many pixels, whatever the scale
const DX = 150;
const DY = 90;
// Where to press, in pixels from the top left of the stage. Empty background at every scale.
const START = { x: 20, y: 20 };

/**
 * Items are placed in em (40 x 30 em at (30,30) a, (100,30) b, (30,80) c, (200,100) d) and 1em is `scale` pixels.
 * The lasso covers x 20..170 and y 20..110 pixels from the stage's top left, so which items it reaches depends on
 * the scale.
 */
const SELECTED_BY_SCALE: Record<number, string> = {
  1: 'a,b,c',
  1.5: 'a,b',
  2: 'a',
};

type Mode = 'em' | 'transform';

async function selectMode(page: Page, mode: Mode) {
  await page.getByTestId(`lasso-mode-${mode}`).click();
  await expect(page.getByTestId('lasso-mode-value')).toHaveText(mode);
}

async function selectScale(page: Page, scale: number) {
  await page.getByTestId(`lasso-scale-option-${scale}`).click();
  await expect(page.getByTestId('lasso-scale-value')).toHaveText(`${scale}`);
}

/**
 * Presses on the stage background, moves by DX and DY while holding, and checks the lasso rectangle that is
 * drawn during the drag. Then releases and checks what was committed and selected.
 */
async function lassoAndCheck(page: Page, scale: number) {
  const stage = page.getByTestId('lasso-stage');
  const stageBox = await getBox(stage);
  const from = offset(stageBox, START.x, START.y);
  const to = offset(from, DX, DY);

  // `startDrag` presses and nudges the pointer, which `tftLasso` does not need, but is harmless
  const drag = await startDrag(page, from, { threshold: 1 });
  await drag.moveTo(to, 15);

  // While the button is still held: the rectangle follows the pointer
  const rect = page.getByTestId('lasso-rect');
  await expect(rect).toBeVisible();
  const actual: Box = await getBox(rect);
  const expected: Box = { x: from.x, y: from.y, width: DX, height: DY };
  const message = `scale ${scale}: lasso rect ${JSON.stringify(
    actual
  )}, expected ${JSON.stringify(expected)}`;
  expect(Math.abs(actual.x - expected.x), `x, ${message}`).toBeLessThanOrEqual(
    1
  );
  expect(Math.abs(actual.y - expected.y), `y, ${message}`).toBeLessThanOrEqual(
    1
  );
  expect(
    Math.abs(actual.width - expected.width),
    `width, ${message}`
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(actual.height - expected.height),
    `height, ${message}`
  ).toBeLessThanOrEqual(1);

  await drag.drop();

  // The rectangle is gone and the committed size, in viewport pixels, is the pointer's move
  await expect(rect).toHaveCount(0);
  expectNear(
    toNumber(await page.getByTestId('lasso-commit-width').textContent()),
    DX
  );
  expectNear(
    toNumber(await page.getByTestId('lasso-commit-height').textContent()),
    DY
  );
  await expect(page.getByTestId('lasso-selected')).toHaveText(
    SELECTED_BY_SCALE[scale]
  );
}

test.describe('Lasso basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interact-demo/features/lasso/basics');
    await expect(page.getByTestId('lasso-selected')).toHaveText('none');
  });

  test('starts at scale 1 and sizes the stage and items in em', async ({
    page,
  }) => {
    await expect(page.getByTestId('lasso-scale-value')).toHaveText('1');
    await expect(page.getByTestId('lasso-stage')).toHaveCSS('font-size', '1px');
    const item = await getBox(page.getByTestId('lasso-item-a'));
    expectNear(item.width, 40);
    expectNear(item.height, 30);
  });

  // How the page binds the rectangle:
  // - em: stage sized in em, rectangle in em (the doc comment on the directive)
  // - transform: stage in px drawn with transform: scale(), rectangle in px
  for (const mode of ['em', 'transform'] as const) {
    test.describe(`rectangle bound in ${mode}`, () => {
      test.beforeEach(async ({ page }) => {
        await selectMode(page, mode);
      });

      for (const scale of [1, 1.5, 2]) {
        test(`at scale ${scale} the lasso rectangle matches the pointer and the selection follows it`, async ({
          page,
        }) => {
          await selectScale(page, scale);
          await expect(page.getByTestId('lasso-stage')).toHaveCSS(
            'font-size',
            `${scale}px`
          );

          await lassoAndCheck(page, scale);
        });
      }

      test('changing the scale after load and then lassoing gives the right rectangle', async ({
        page,
      }) => {
        // A first lasso at the initial scale, then change it and lasso again
        await lassoAndCheck(page, 1);

        await selectScale(page, 2);
        await lassoAndCheck(page, 2);
      });
    });
  }
});
