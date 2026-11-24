import {
  ErrorDictionary,
  getErrorMessage,
  lookupErrorMessage,
} from './form-errors';

describe('getErrorMessage', () => {
  it('returns null when errors is null', () => {
    expect(getErrorMessage(null)).toBeNull();
  });

  it('returns null when errors is undefined', () => {
    expect(getErrorMessage(undefined)).toBeNull();
  });

  it('returns null when the errors object is empty', () => {
    expect(getErrorMessage({})).toBeNull();
  });

  it('returns the default message for a known key', () => {
    expect(getErrorMessage({ required: true })).toBe('This field is required');
  });

  it('prefers the caller dictionary over the default message for the same key', () => {
    const dictionary: ErrorDictionary = {
      required: () => 'Please fill this in',
    };
    expect(getErrorMessage({ required: true }, dictionary)).toBe(
      'Please fill this in'
    );
  });

  it('keeps the default messages for keys the caller dictionary does not override', () => {
    const dictionary: ErrorDictionary = {
      required: () => 'Please fill this in',
    };
    expect(getErrorMessage({ email: true }, dictionary)).toBe(
      'Please enter a valid email address'
    );
  });

  it('supports a custom key added by the caller dictionary', () => {
    const dictionary: ErrorDictionary = {
      noSpaces: () => 'Spaces are not allowed',
    };
    expect(getErrorMessage({ noSpaces: true }, dictionary)).toBe(
      'Spaces are not allowed'
    );
  });

  it('uses only the first error when there are several', () => {
    expect(getErrorMessage({ email: true, required: true })).toBe(
      'Please enter a valid email address'
    );
  });

  it('falls back to the default entry when the key is unknown', () => {
    expect(getErrorMessage({ somethingUnknown: true })).toBe(
      'A default error occurred'
    );
  });

  it('falls back to the caller dictionary default entry when the key is unknown', () => {
    const dictionary: ErrorDictionary = { default: () => 'Something is wrong' };
    expect(getErrorMessage({ somethingUnknown: true }, dictionary)).toBe(
      'Something is wrong'
    );
  });

  it('passes the error value to the message factory', () => {
    expect(
      getErrorMessage({ minlength: { requiredLength: 5, actualLength: 2 } })
    ).toBe('Minimum of 5 characters required, but you entered 2');
  });
});

describe('lookupErrorMessage', () => {
  it('does not merge in the default messages', () => {
    const dictionary: ErrorDictionary = { default: () => 'custom default' };
    expect(lookupErrorMessage({ required: true }, dictionary)).toBe(
      'custom default'
    );
  });

  it('returns null when there are no errors', () => {
    expect(lookupErrorMessage(null, { default: () => 'x' })).toBeNull();
  });
});
