# Changelog

## 21.1.0

Angular modernization: standalone, signals, zoneless-ready and `strictTemplates`-clean.

### Deprecated
- `FormValidationHandlerModule` is deprecated. It still works, but it will be removed in the next major version. Import the standalone `ControlErrorsDirective`, `ControlErrorsFormDirective`, `ControlErrorContainerDirective` and `ControlErrorComponent` directly.

### Changed (may need code updates)
- Inputs are signal-based (`input()`). Template bindings work as before. Code that set an input directly (`instance.foo = x`) must use `ComponentRef.setInput()` instead.
- `ControlErrorComponent` exposes `text()` and `hide()` signals in place of the old `_text` and `_hide` fields.
- No longer uses `ChangeDetectorRef`. Works in zoneless apps (`provideZonelessChangeDetection()`) as well as zone-based ones.
