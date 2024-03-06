import { FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function convertBytesToMb( bytes: number): number {
  return bytes/1048576;
}

export function maxFileSizeValidator(maxFileSize: number): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    const controlValue = control.value;
    if (!(controlValue instanceof File)) {
      return null;
    }
    const actualFileSize = +convertBytesToMb(controlValue.size).toPrecision(3);
    if (maxFileSize > actualFileSize) return null;
    return {maxFileSize: { maxFileSize, actualFileSize }};
  }
}

export function allowedFileExtValidator(allowedFileExtensions: string[], onlyAllowFiles = true): ValidatorFn {
  return (control: FormControl): ValidationErrors | null => {
    const controlValue = control.value;
    const isFile = controlValue instanceof File;
    if (!onlyAllowFiles && !isFile) return null;
    const actualExtension = isFile ? controlValue.name.split('.').pop().toLocaleLowerCase() : 'Not a file';
    const isAllowedExtension = allowedFileExtensions.includes(actualExtension);
    if(isAllowedExtension) {
      return null;
    }
    return {allowedExtension: { allowedFileExtensions, actualExtension }};
  }
}

export function allowedFileType(matchExp: string | RegExp): ValidatorFn {
  return (formControl) => {
    const value = (formControl as FormControl).value;
    if (!(value instanceof File)) return null
    const type = value.type;
    const matches = type.match(matchExp)
    if (!type || !matches?.length) {
      return {
        allowedFileType: {
          actualType: type,
          allowedTypeExp: matchExp
        }
      }
    } else {
      return null
    }
  };
}
