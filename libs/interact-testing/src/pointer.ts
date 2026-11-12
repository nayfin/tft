import type { Locator, Page } from '@playwright/test';
import {
  Box,
  Edge,
  Point,
  centerOf,
  edgePoint,
  offset,
  pointIn,
} from './geometry';

/*
 * Pointer actions built on `page.mouse`.
 *
 * Playwright's `locator.dragTo()` sends too few pointer events for interactjs to start a drag, so these helpers
 * press the button, nudge past interact's movement threshold, then move to the target in small steps.
 */

export interface PointerOptions {
  /** Pointer moves between the start and the end of the drag. More steps are slower but more realistic. Default 20. */
  steps?: number;
  /** Pixels to move after pressing, so interact registers a drag instead of a click. Default 6. */
  threshold?: number;
}

export interface GrabOptions extends PointerOptions {
  /**
   * Where to press, if not on the locator itself. Use it for a drag handle: pass the handle's locator
   * and the element is dragged by it. The handle is a child of the element in most cases.
   */
  grab?: Locator;
  /** Where inside the grabbed element to press, as fractions of its size. Default the centre. */
  grabAt?: Point;
}

export interface DragOntoOptions extends GrabOptions {
  /** Where inside the dropzone to release, as fractions of its size. Default the centre. */
  dropAt?: Point;
}

export interface ResizeOptions extends PointerOptions {
  /** Pixels inside the edge to press. Default 4. */
  inset?: number;
}

/** A drag in progress, for asserting on the page between the moves and the release. */
export interface DragSession {
  /** Moves the pointer to `to`, in steps. Can be called any number of times. */
  moveTo(to: Point, steps?: number): Promise<void>;
  /** Releases the pointer at its current position. */
  drop(): Promise<void>;
}

const DEFAULT_STEPS = 20;
const DEFAULT_THRESHOLD = 6;

async function measure(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error(
      `Cannot get a bounding box for ${locator}. Is it rendered and visible?`
    );
  }
  return box;
}

/**
 * Waits for what @tft/interact does after a drop: it removes the drag clone in a `setTimeout`, so for a moment
 * after the pointer is released there are two elements with the same `data-testid`. Waiting a frame and a task
 * means locators by test id are unique again when this returns.
 */
async function settle(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => setTimeout(resolve))
      )
  );
}

/** Scrolls a locator into view and returns its bounding box. Throws if it is not rendered. */
export async function getBox(locator: Locator): Promise<Box> {
  await locator.scrollIntoViewIfNeeded();
  return measure(locator);
}

/**
 * Presses the pointer at `from` and nudges it past interact's drag threshold, but does not move any further.
 * Call `moveTo` to move, and `drop` to release. Use it to assert on mid-drag state, such as a drag preview.
 * `drop` waits until the drag clone has been removed.
 */
export async function startDrag(
  page: Page,
  from: Point,
  opts: PointerOptions = {}
): Promise<DragSession> {
  const threshold = opts.threshold ?? DEFAULT_THRESHOLD;
  const steps = opts.steps ?? DEFAULT_STEPS;

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + threshold, from.y + threshold, { steps: 2 });

  return {
    moveTo: (to, moveSteps = steps) =>
      page.mouse.move(to.x, to.y, { steps: moveSteps }),
    drop: async () => {
      await page.mouse.up();
      await settle(page);
    },
  };
}

/** Presses at `from`, moves to `to` and releases. */
export async function pointerDrag(
  page: Page,
  from: Point,
  to: Point,
  opts: PointerOptions = {}
): Promise<void> {
  const drag = await startDrag(page, from, opts);
  await drag.moveTo(to);
  await drag.drop();
}

/** Where to press on an element: its centre, a point inside it, or the centre of a handle. */
async function grabPoint(locator: Locator, opts: GrabOptions): Promise<Point> {
  const box = await getBox(opts.grab ?? locator);
  return opts.grabAt ? pointIn(box, opts.grabAt) : centerOf(box);
}

/** Drags an element by `dx` and `dy` pixels. */
export async function dragBy(
  page: Page,
  locator: Locator,
  dx: number,
  dy: number,
  opts: GrabOptions = {}
): Promise<void> {
  const from = await grabPoint(locator, opts);
  await pointerDrag(page, from, offset(from, dx, dy), opts);
}

/**
 * Drags an element onto a dropzone and releases it inside. Interact's default dropzone overlap is `pointer`,
 * so the pointer has to end up inside the dropzone element, which is what this aims for.
 */
export async function dragOnto(
  page: Page,
  source: Locator,
  dropzone: Locator,
  opts: DragOntoOptions = {}
): Promise<void> {
  // Scroll the dropzone first: the source is scrolled into view when it is grabbed, and has to be measured after
  await dropzone.scrollIntoViewIfNeeded();
  const from = await grabPoint(source, opts);
  const to = pointIn(
    await measure(dropzone),
    opts.dropAt ?? { x: 0.5, y: 0.5 }
  );
  await pointerDrag(page, from, to, opts);
}

/**
 * Resizes an element by pressing just inside one of its edges (or corners) and moving the pointer by `dx` and `dy`.
 * The edge has to be enabled in the element's `resizeConfig`.
 */
export async function resizeBy(
  page: Page,
  locator: Locator,
  edge: Edge,
  dx: number,
  dy: number,
  opts: ResizeOptions = {}
): Promise<void> {
  const from = edgePoint(await getBox(locator), edge, opts.inset);
  await pointerDrag(page, from, offset(from, dx, dy), opts);
}
