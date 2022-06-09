import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

export function someControlIsValid(controlNames: string[]): ValidatorFn {
  return (formGroup: UntypedFormGroup) => {
    const controls = controlNames.map(controlName => formGroup.get(controlName));
    const someControlIsValid = controls.some((control) => control.valid);
    if (someControlIsValid) {
      controls.forEach(control => {
        // mark all controls as valid
        control.setErrors(null);
      });
      return null
    }
    controls.forEach(control => control.setErrors({someControlIsValid: {controlNames}}))
    return { controlNames }
  };
}

