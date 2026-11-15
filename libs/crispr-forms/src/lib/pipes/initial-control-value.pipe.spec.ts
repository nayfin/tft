import { ControlType, InputFieldConfig, HeadingConfig } from '../utils';
import { InitialControlValuePipe } from './initial-control-value.pipe';

describe('InitialControlValuePipe', () => {
  const pipe = new InitialControlValuePipe();
  const inputConfig: InputFieldConfig = {
    controlName: 'name',
    controlType: ControlType.INPUT,
    label: 'Name',
  };

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the initial value for the control', () => {
    expect(pipe.transform({ name: 'Ada' }, inputConfig)).toBe('Ada');
  });

  it('should return null when the initial value has no entry for the control', () => {
    expect(pipe.transform({ other: 'x' }, inputConfig)).toBeNull();
  });

  it('should return null when there is no initial value', () => {
    expect(pipe.transform(null, inputConfig)).toBeNull();
  });

  it('should return null for a field that is not a control', () => {
    const heading: HeadingConfig = { label: 'A heading' };
    expect(pipe.transform({ name: 'Ada' }, heading)).toBeNull();
  });
});
