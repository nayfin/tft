import { TftDragEvent } from '@tft/interact';

/** What the feature pages show under each example. */
export interface Readout {
  /** Name of the last event that fired, or `none` */
  event: string;
  x: number;
  y: number;
}

/** Rounds a position so that readouts are stable and easy to read. */
export function toReadout(
  event: string,
  position: { x: number; y: number } | null | undefined,
  fallback: Readout
): Readout {
  return position
    ? { event, x: Math.round(position.x), y: Math.round(position.y) }
    : { ...fallback, event };
}

/** Builds the readout for a drag event, from where the dragged element is inside its dropzone. */
export function readDrag(
  event: string,
  e: TftDragEvent,
  previous: Readout
): Readout {
  return toReadout(event, e.positionInDropTarget, previous);
}
