import { UntypedFormControl, ValidatorFn } from "@angular/forms";

export function minArrayLength(minLength: number): ValidatorFn {
  return (formControl: UntypedFormControl) => {
    const value = formControl.value;
    const length = Array.isArray(value) ? value.length : 0;
    if (minLength <= length) return null;
    return {
      minArrayLength: {
        requiredMinArrayLength: minLength,
        actualArrayLength: length
      }
    }
  };
}
