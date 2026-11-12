import { expect } from '@playwright/test';

/**
 * Asserts that a measured value is within `tolerance` pixels of the expected one.
 * Browsers round sizes and positions to fractions of a pixel, so exact equality is too strict. A tolerance of 1px
 * is still far smaller than any move these specs make, so a drag that did nothing fails.
 */
export function expectNear(
  actual: number,
  expected: number,
  tolerance = 1
): void {
  expect(
    Math.abs(actual - expected),
    `expected ${actual} to be within ${tolerance} of ${expected}`
  ).toBeLessThanOrEqual(tolerance);
}

/** Reads a numeric readout, such as the text of a `data-testid="...-x"` element. */
export function toNumber(text: string | null): number {
  return Number(text);
}
