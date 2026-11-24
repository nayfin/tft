# Changelog

## 21.2.0

### Added
- `getErrorMessage(controlErrors, dictionary?)` builds the message for a control's errors the way `ControlErrorsDirective` does. It uses the first error only, looks its key up in the library defaults with your `dictionary` taking precedence, falls back to the `default` entry for an unknown key, and returns `null` when there are no errors. `ControlErrorsDirective` uses the same lookup, so its behaviour is unchanged.

## 21.1.1

### Fixed
- `ControlErrorsDirective` reads the form's `errorDictionary` each time it builds a message instead of once when it is created, so a dictionary that is bound late or changes later is used. `errors` is now a getter and setter backed by a signal, and keeps working as before for code that read or assigned it.
- `ErrorDictionary` and `ErrorFactory` are exported as types, so the package compiles under `isolatedModules`.

## 21.1.0

Angular modernization: standalone, signals, zoneless-ready and `strictTemplates`-clean.

### Deprecated
- `FormValidationHandlerModule` is deprecated. It still works, but it will be removed in the next major version. Import the standalone `ControlErrorsDirective`, `ControlErrorsFormDirective`, `ControlErrorContainerDirective` and `ControlErrorComponent` directly.

### Changed (may need code updates)
- Inputs are signal-based (`input()`). Template bindings work as before. Code that set an input directly (`instance.foo = x`) must use `ComponentRef.setInput()` instead.
- `ControlErrorComponent` exposes `text()` and `hide()` signals in place of the old `_text` and `_hide` fields.
- No longer uses `ChangeDetectorRef`. Works in zoneless apps (`provideZonelessChangeDetection()`) as well as zone-based ones.
