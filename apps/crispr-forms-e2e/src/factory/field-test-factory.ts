import { test } from '../fixtures/angular-test';
import { AnyFieldConfig, ControlType, InputFieldConfig } from '@tft/crispr-forms/utils';
import { testInputField } from './field-tests/input.tests';

export function testField(config: AnyFieldConfig) {
  // Skip non-control fields
  if (!('controlName' in config)) return;

  test.describe(config.controlName, () => {
    switch (config.controlType) {
      case ControlType.INPUT:
        testInputField(config as InputFieldConfig);
        break;
      // Additional field types will be added here as we build them out
    }
  });
}
