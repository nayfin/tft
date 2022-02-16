/**
 * Interface for the error dictionary
 */
interface ErrorDictionary<T = string> { [key: string]: ErrorFactory<T>; }

/**
 * Interface for individual errors in error dictionary.
 * Optionally takes an object as an argument from the thrown validation error,
 * which it can use to build more informative error messages
 */
type ErrorFactory<T = string> = (errorObject: {[key: string]: T}) => string;

/**
 * Dictionary of the default errors used by the control-errors directive to map
 * validator key to error message
 */
export const defaultErrors: ErrorDictionary<string | string[]> = {
  default: () => `A default error occurred`,
  required: () => `This field is required`,
  // the 'requiredTrue' error won't called unless using a custom validator
  // the @angular/forms team rejected our proposal to rename key in error object
  requiredTrue: () => `The conditions must be accepted`,
  email: () => `Please enter a valid email address`,
  minlength: ({ requiredLength, actualLength }) => `Minimum of ${requiredLength} characters required, but you entered ${actualLength}`,
  maxlength: ({ requiredLength, actualLength }) => `Maximum of ${requiredLength} characters allowed, but you entered ${actualLength}`,
  min: ({min, actual}) => `The minimum allowed value is ${min}, actual value is ${actual}`,
  max: ({max, actual}) => `The maximum allowed value is ${max}, actual value is ${actual}`,
  pattern: ({requiredPattern, actualValue}) => `${actualValue} fails to match pattern ${requiredPattern}`,
  maxFileSize: ({actualFileSize, maxFileSize} ) => `The maximum allowed file size is ${maxFileSize} MB, actual file size is ${actualFileSize} MB`,
  allowedExtension: ({ allowedFileExtensions, actualExtension }: { allowedFileExtensions: string[], actualExtension: string }) =>
    `The allowed file extensions are: ${allowedFileExtensions.join(', ')}. Actual file extension is ${actualExtension}`,
  someControlIsValid: ({controlNames}: {controlNames: string[]}) => `At least one of the the following fields must be valid: ${controlNames.join(', ')}`
};

/**
 * We export the interfaces so end users can easily strongly type their own custom error dictionary
 */
export { ErrorDictionary, ErrorFactory };
