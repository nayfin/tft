import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { getProcessingState } from './getProcessingState';

const processing = { imageProcessing: true };
const failed = { imageProcessingFailed: { message: 'x' } };

/** A control that holds the given errors, whatever its validators say */
const controlWith = (errors: Record<string, unknown> | null) => {
  const control = new FormControl(null);
  control.setErrors(errors);
  return control;
};

describe('getProcessingState', () => {
  it('is idle when nothing has an error', () => {
    const group = new FormGroup({ a: controlWith(null) });

    expect(getProcessingState(group)).toBe('idle');
  });

  it('is idle for a group without controls', () => {
    expect(getProcessingState(new FormGroup({}))).toBe('idle');
  });

  it('is processing when a field is processing', () => {
    const group = new FormGroup({
      a: controlWith(null),
      b: controlWith(processing),
    });

    expect(getProcessingState(group)).toBe('processing');
  });

  it('is failed when a field failed', () => {
    const group = new FormGroup({ a: controlWith(failed) });

    expect(getProcessingState(group)).toBe('failed');
  });

  it('is processing when one field is processing and another failed', () => {
    const group = new FormGroup({
      a: controlWith(failed),
      b: controlWith(processing),
    });

    expect(getProcessingState(group)).toBe('processing');
  });

  it('finds the processing error when it is not the first key', () => {
    const group = new FormGroup({
      a: controlWith({ required: true, imageProcessing: true }),
    });

    expect(getProcessingState(group)).toBe('processing');
  });

  it('finds the failed error when it is not the first key', () => {
    const group = new FormGroup({
      a: controlWith({
        required: true,
        imageProcessingFailed: { message: 'x' },
      }),
    });

    expect(getProcessingState(group)).toBe('failed');
  });

  it('ignores unrelated errors', () => {
    const group = new FormGroup({
      a: controlWith({ required: true }),
      b: controlWith({ custom: true }),
    });

    expect(getProcessingState(group)).toBe('idle');
  });

  it('finds a field in a nested sub-group', () => {
    const group = new FormGroup({
      address: new FormGroup({
        photo: new FormGroup({ image: controlWith(processing) }),
      }),
    });

    expect(getProcessingState(group)).toBe('processing');
  });

  it('finds a field in a group list item', () => {
    const group = new FormGroup({
      photos: new FormArray([
        new FormGroup({ image: controlWith(null) }),
        new FormGroup({ image: controlWith(failed) }),
      ]),
    });

    expect(getProcessingState(group)).toBe('failed');
  });

  it('reads a single control too', () => {
    expect(getProcessingState(controlWith(processing))).toBe('processing');
  });

  it('skips a disabled control', () => {
    const disabled = controlWith(null);
    disabled.disable();
    // errors can still be set by hand on a disabled control
    disabled.setErrors(processing);
    const group = new FormGroup({ a: disabled, b: controlWith(null) });

    expect(getProcessingState(group)).toBe('idle');
  });

  it('skips a disabled group', () => {
    const group = new FormGroup({
      other: controlWith(null),
      address: new FormGroup({ image: controlWith(null) }),
    });
    group.get('address').disable();
    group.get('address.image').setErrors(failed);

    expect(getProcessingState(group)).toBe('idle');
  });
});
