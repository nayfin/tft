/**
 * Pure geometry helpers. This file has no Playwright imports, so it can be used (and unit tested)
 * anywhere. A `Box` matches the shape returned by Playwright's `locator.boundingBox()`.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Edge =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/** The centre of a box. */
export function centerOf(box: Box): Point {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/**
 * A point inside a box, given as fractions of its width and height.
 * `{ x: 0, y: 0 }` is the top-left corner, `{ x: 1, y: 1 }` the bottom-right, `{ x: 0.5, y: 0.5 }` the centre.
 */
export function pointIn(box: Box, fraction: Point): Point {
  return {
    x: box.x + box.width * fraction.x,
    y: box.y + box.height * fraction.y,
  };
}

/** A point moved by `dx` and `dy`. */
export function offset(point: Point, dx: number, dy: number): Point {
  return { x: point.x + dx, y: point.y + dy };
}

/** How a box moved and resized: `after` minus `before`, for each of x, y, width and height. */
export function boxDelta(before: Box, after: Box): Box {
  return {
    x: after.x - before.x,
    y: after.y - before.y,
    width: after.width - before.width,
    height: after.height - before.height,
  };
}

/**
 * A point just inside one edge or corner of a box, where a resize handle sits.
 * Edges are centred along the other axis; corners are `inset` pixels in from both sides.
 */
export function edgePoint(box: Box, edge: Edge, inset = 4): Point {
  const left = box.x + inset;
  const right = box.x + box.width - inset;
  const top = box.y + inset;
  const bottom = box.y + box.height - inset;
  const middle = centerOf(box);

  switch (edge) {
    case 'top':
      return { x: middle.x, y: top };
    case 'right':
      return { x: right, y: middle.y };
    case 'bottom':
      return { x: middle.x, y: bottom };
    case 'left':
      return { x: left, y: middle.y };
    case 'top-left':
      return { x: left, y: top };
    case 'top-right':
      return { x: right, y: top };
    case 'bottom-left':
      return { x: left, y: bottom };
    case 'bottom-right':
      return { x: right, y: bottom };
  }
}
