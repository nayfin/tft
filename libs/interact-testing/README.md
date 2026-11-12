# @tft/interact-testing

Playwright helpers for testing drag, drop and resize built with [`@tft/interact`](../interact/README.md).

Interactjs needs a real stream of pointer events, and Playwright's `locator.dragTo()` doesn't send enough of them to start a drag. These helpers press the pointer, move past interact's drag threshold, then move to the target in small steps, so drags and resizes behave as they do for a user.

## Installation

```bash
npm install --save-dev @tft/interact-testing
```

Peer dependency: `@playwright/test` (>= 1.40).

## Example

```ts
import { test, expect } from '@playwright/test';
import {
  boxDelta,
  dragBy,
  dragOnto,
  getBox,
  resizeBy,
} from '@tft/interact-testing';

test('an item moves by the pointer delta', async ({ page }) => {
  await page.goto('/board');
  const card = page.getByTestId('card-1');
  const before = await getBox(card);

  await dragBy(page, card, 120, 60);

  const delta = boxDelta(before, await getBox(card));
  expect(delta.x).toBeCloseTo(120, 0);
  expect(delta.y).toBeCloseTo(60, 0);
});

test('a card can be dropped into another column', async ({ page }) => {
  await page.goto('/board');
  await dragOnto(
    page,
    page.getByTestId('card-1'),
    page.getByTestId('column-done')
  );
  await expect(
    page.getByTestId('column-done').getByTestId('card-1')
  ).toBeVisible();
});

test('a panel can be resized from its corner', async ({ page }) => {
  await page.goto('/board');
  await resizeBy(page, page.getByTestId('panel'), 'bottom-right', 80, 40);
});
```

To check what the page looks like in the middle of a drag, such as a drag preview, use `startDrag`:

```ts
const drag = await startDrag(page, centerOf(await getBox(card)));
await drag.moveTo({ x: 400, y: 300 });
await expect(page.getByTestId('preview')).toBeVisible();
await drag.drop();
await expect(page.getByTestId('preview')).toHaveCount(0);
```

## API

### Pointer actions

All of them take the Playwright `page` first and press and release `page.mouse`.

| Function                                       | Does                                                                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `dragBy(page, locator, dx, dy, opts?)`         | Presses the centre of the element and drags it by `dx`, `dy` pixels                                                    |
| `dragOnto(page, source, dropzone, opts?)`      | Presses the centre of `source`, drags it into `dropzone` and releases there                                            |
| `resizeBy(page, locator, edge, dx, dy, opts?)` | Presses just inside an edge or corner of the element and moves the pointer by `dx`, `dy` pixels                        |
| `pointerDrag(page, from, to, opts?)`           | Presses at a point, moves to another and releases. The others are built on this                                        |
| `startDrag(page, from, opts?)`                 | Presses and crosses the drag threshold, then returns `{ moveTo(point, steps?), drop() }` so a spec can assert mid-drag |
| `getBox(locator)`                              | Scrolls the element into view and returns its bounding box. Throws if it isn't rendered                                |

Options:

| Option      | Applies to           | Default              | Meaning                                                                                              |
| ----------- | -------------------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| `steps`     | all                  | `20`                 | Pointer moves between the start and the end. `drop()` waits for the library to clean up after itself |
| `threshold` | all                  | `6`                  | Pixels moved right after pressing, so interact starts a drag instead of a click                      |
| `grab`      | `dragBy`, `dragOnto` | the element          | A locator to press instead, such as a drag handle                                                    |
| `grabAt`    | `dragBy`, `dragOnto` | `{ x: 0.5, y: 0.5 }` | Where to press inside the grabbed element, as fractions of its size                                  |
| `dropAt`    | `dragOnto`           | `{ x: 0.5, y: 0.5 }` | Where to release inside the dropzone, as fractions of its size                                       |
| `inset`     | `resizeBy`           | `4`                  | Pixels inside the edge to press                                                                      |

`edge` is one of `'top'`, `'right'`, `'bottom'`, `'left'`, `'top-left'`, `'top-right'`, `'bottom-left'` or `'bottom-right'`, and has to be enabled in the element's `resizeConfig`.

### Geometry

Pure functions on plain `{ x, y, width, height }` boxes and `{ x, y }` points. They import nothing from Playwright, so they can be used anywhere.

| Function                          | Returns                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `centerOf(box)`                   | The centre point                                                                                                                |
| `pointIn(box, { x, y })`          | A point inside the box, from fractions of its size (`{ x: 0, y: 0 }` is the top-left corner, `{ x: 1, y: 1 }` the bottom-right) |
| `offset(point, dx, dy)`           | The point moved by `dx`, `dy`                                                                                                   |
| `boxDelta(before, after)`         | `after` minus `before` for `x`, `y`, `width` and `height`                                                                       |
| `edgePoint(box, edge, inset = 4)` | A point just inside an edge or corner, where a resize handle sits                                                               |

## Gotchas

**Don't use `dragTo()`.** It doesn't send the stream of pointer events interactjs needs. Use `dragBy`, `dragOnto` or `startDrag`.

**Start inside a `user-select: none` element.** `tftDraggable` sets it on its host. If a drag starts on selectable text, such as a label outside the draggable, the browser starts a text selection and interact never sees the drag. Press the draggable host (or a handle inside it), not the text next to it.

**Same-zone moves reposition the original.** The clone follows the pointer, and when you drop inside the dropzone the draggable lives in, the original element is moved to the drop position. Without `showPlaceholder` the original is hidden for the duration of the drag; with it, the original stays visible and in place until the drop. Moving an item to another zone is up to your `dragDrop` handler.

**The clone has the same `data-testid`.** While a drag is in progress, the clone in the drag root carries the same attributes as the original, including `data-testid`. Playwright's strict mode then sees two matches. Scope the locator to the dropzone (`zone.getByTestId('card')`) for the original, or to the drag root (`root.locator(':scope > [data-testid="card"]')`) for the clone. `drop()` and the other actions wait until the clone is removed, so a plain `getByTestId` is unique again once they return.

**Aim at the element that has `tftDropzone`.** `dragOnto` releases inside the box of the locator you pass. If a wrapper is bigger than the dropzone element, or the dropzone is a child, the pointer can end up outside it and no `dragDrop` fires. Interact's default overlap is `pointer`, so the release point is what counts.

**Dropzones clipped by overflow.** If the dropzone is partly hidden by an `overflow` container, the centre may be off screen or covered. Pass `dropAt` to aim at a part that is visible.

**Keep the drag inside the viewport.** Elements near the edge of the viewport can be scrolled while the pointer is moved, and the pointer can leave the page. The actions scroll the element into view first, but for tall pages a larger viewport (`use: { viewport: { width: 1280, height: 1400 } }`) is the simplest fix.

**Icon buttons need a test id.** Buttons that only contain a `mat-icon` have no text to select by. Give them a `data-testid` or an `aria-label`.

**Comparing positions.** Browsers round to fractions of a pixel, and a drag that starts a few pixels from where you meant can land a pixel off. Compare with a small tolerance (a pixel or two) instead of exact equality, but keep it far smaller than the distance you move, so a drag that did nothing still fails.

## Debugging

Run the spec with a visible browser, or step through it:

```bash
npx playwright test --headed
npx playwright test --debug
```

If a drag does nothing, add `--headed` and watch whether the pointer presses the element you expect, then check the gotchas above.
