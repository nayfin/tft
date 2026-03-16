// Load Angular's JIT compiler. Required because crispr-forms uses partial compilation
// (Ivy linker format) which needs the JIT compiler as a fallback in Node/Playwright environments.
import '@angular/compiler';

// Re-export Playwright so consumers only need one import.
export * from '@playwright/test';

export * from './helpers/form.helpers';
export * from './field-tests/input.tests';
export * from './field-tests/textarea.tests';
export * from './field-tests/checkbox.tests';
export * from './field-tests/select.tests';
export * from './field-tests/slider.tests';
export * from './field-tests/datepicker.tests';
export * from './field-tests/autocomplete.tests';
export * from './field-tests/autocomplete-chiplist.tests';
export * from './field-tests/file-upload.tests';
export * from './field-tests/unit-conversion.tests';
export * from './field-tests/field-test-factory';
