/**
 * Interface for the error dictionary
 */
interface ErrorDictionary { [key: string]: ErrorFactory; }

/**
 * Interface for individual errors in error dictionary.
 * Optionally takes an object as an argument from the thrown validation error,
 * which it can use to build more informative error messages
 */
type ErrorFactory = (errorObject: {[key: string]: string}) => string;

/**
 * Dictionary of the default errors used by the control-errors directive to map
 * validator key to error message
 */
export const defaultErrors: ErrorDictionary = {
  default: () => `A default error occurred`,
  required: () => `This field is required`,
  // the 'requiredTrue' error won't called unless using a custom validator
  // the @angular/forms team will rejected our proposal to rename key in error object
  requiredTrue: () => `The conditions must be accepted`,
  email: () => `Please enter a valid email address`,
  minlength: ({ requiredLength, actualLength }) => `Minimum of ${requiredLength} characters required, but you entered ${actualLength}`,
  maxlength: ({ requiredLength, actualLength }) => `Maximum of ${requiredLength} characters allowed, but you entered ${actualLength}`,
  min: ({min, actual}) => `Minimum allowed value is ${min}, actual value is ${actual}`,
  max: ({max, actual}) => `Maximum allowed value is ${max}, actual value is ${actual}`,
  pattern: ({requiredPattern, actualValue}) => `${actualValue} fails to match pattern ${requiredPattern}`,
  someControlIsValid: ({controlNames}) => `At least one of the these fields must be valid`
};

/**
 * We export the interfaces so end users can easily strongly type their own custom error dictionary
 */
export { ErrorDictionary, ErrorFactory };
