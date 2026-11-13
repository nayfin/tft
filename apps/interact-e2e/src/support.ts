import { expect } from '@playwright/test';
import type { Box } from '@tft/interact-testing';

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

/** Asserts that every field of a box (x, y, width, height) is within `tolerance` pixels of the expected box. */
export function expectBoxNear(actual: Box, expected: Box, tolerance = 1): void {
  expectNear(actual.x, expected.x, tolerance);
  expectNear(actual.y, expected.y, tolerance);
  expectNear(actual.width, expected.width, tolerance);
  expectNear(actual.height, expected.height, tolerance);
}

/**
 * Reads a numeric readout, such as the text of a `data-testid="...-x"` element.
 * Throws on missing or non-numeric text (`Number(null)` and `Number('')` are 0, which could pass by accident).
 */
export function toNumber(text: string | null): number {
  const value = text?.trim() ? Number(text) : NaN;
  if (Number.isNaN(value)) {
    throw new Error(`expected a numeric readout, got ${JSON.stringify(text)}`);
  }
  return value;
}
