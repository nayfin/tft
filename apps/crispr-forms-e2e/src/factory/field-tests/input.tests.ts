import { test, expect } from '../../fixtures/angular-test';
import { InputFieldConfig } from '@tft/crispr-forms/utils';
import { Validators } from '@angular/forms';
import { getInput, getError, getLabel, getHint, touchInput } from '../../helpers/form.helpers';

export function testInputField(config: InputFieldConfig) {
  test('renders label', async ({ page }) => {
    await expect(getLabel(page, config.controlName)).toHaveText(config.label);
  });

  test(`has input type "${config.inputType ?? 'text'}"`, async ({ page }) => {
    await expect(getInput(page, config.controlName)).toHaveAttribute('type', config.inputType ?? 'text');
  });

  if (config.placeholder) {
    test('renders placeholder', async ({ page }) => {
      await expect(getInput(page, config.controlName)).toHaveAttribute('placeholder', config.placeholder);
    });
  }

  if (config.hint) {
    test('shows hint when untouched', async ({ page }) => {
      await expect(getHint(page, config.controlName)).toBeVisible();
    });
  }

  if (config.validators?.includes(Validators.required)) {
    test('shows required error when blurred empty', async ({ page }) => {
      await touchInput(page, config.controlName);
      await expect(getError(page, config.controlName)).toBeVisible();
    });
  }

  if (config.min !== undefined) {
    test(`shows error when value is below min (${config.min})`, async ({ page }) => {
      await getInput(page, config.controlName).fill(String(config.min - 1));
      await touchInput(page, config.controlName);
      await expect(getError(page, config.controlName)).toBeVisible();
    });

    test(`accepts value at min boundary (${config.min})`, async ({ page }) => {
      await getInput(page, config.controlName).fill(String(config.min));
      await touchInput(page, config.controlName);
      await expect(getError(page, config.controlName)).not.toBeVisible();
    });
  }

  if (config.max !== undefined) {
    test(`shows error when value exceeds max (${config.max})`, async ({ page }) => {
      await getInput(page, config.controlName).fill(String(config.max + 1));
      await touchInput(page, config.controlName);
      await expect(getError(page, config.controlName)).toBeVisible();
    });

    test(`accepts value at max boundary (${config.max})`, async ({ page }) => {
      await getInput(page, config.controlName).fill(String(config.max));
      await touchInput(page, config.controlName);
      await expect(getError(page, config.controlName)).not.toBeVisible();
    });
  }

  if (config.maxLength !== undefined) {
    test(`enforces maxLength of ${config.maxLength}`, async ({ page }) => {
      const overLimit = 'a'.repeat(config.maxLength + 1);
      await getInput(page, config.controlName).fill(overLimit);
      const value = await getInput(page, config.controlName).inputValue();
      expect(value.length).toBeLessThanOrEqual(config.maxLength);
    });
  }
}
