import type { AbstractControl } from '@angular/forms';

/**
 * One invalid field in a form, as reported by `getInvalidFields`.
 * There is one entry per invalid field, built from the field's first error.
 */
export interface InvalidField {
  /** Dot path of the control in the form, e.g. `photos.1.caption`. Empty for the top-level form. */
  path: string;
  /** Human name of the field, e.g. `Caption in Photos 2`. */
  label: string;
  /** The error message, from the form's `errorDictionary` or the library defaults. */
  message: string;
  /** The first error key on the control, e.g. `required`. */
  errorKey: string;
  control: AbstractControl;
}
