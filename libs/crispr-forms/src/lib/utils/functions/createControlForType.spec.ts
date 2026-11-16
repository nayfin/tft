import { FormControl } from '@angular/forms';
import { ControlType, InputFieldConfig } from '../models';
import { createControlForType } from './createControlForType';

describe('createControlForType', () => {
  const config: InputFieldConfig = {
    controlType: ControlType.INPUT,
    controlName: 'amount',
    label: 'Amount',
    inputType: 'number',
    valueAsNumber: true,
  };

  it('should keep a falsy initial value such as 0', () => {
    const control = createControlForType(config, 0) as FormControl;

    expect(control.value).toBe(0);
  });

  it('should default to null when no initial value is given', () => {
    const control = createControlForType(config) as FormControl;

    expect(control.value).toBeNull();
  });
});
