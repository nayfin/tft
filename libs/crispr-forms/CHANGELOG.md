# Changelog

## 21.1.0

Angular modernization: standalone, signals, zoneless-ready and `strictTemplates`-clean.

### Deprecated
- `CrisprFormsModule`, `CrisprPipesModule` and `SubGroupModule` are deprecated. They still work, but they will be removed in the next major version. Import the standalone pieces (`CrisprFormComponent`, `FieldContainerComponent`, `SubGroupComponent`, `InitialControlValuePipe`, …) directly.

### Changed (may need code updates)
- All inputs, outputs and view queries are signal-based (`input()`, `output()`, `viewChild()`). Template bindings work as before. Code that set a component input directly (`instance.foo = x`) must use `ComponentRef.setInput()` instead.
- Outputs are `OutputEmitterRef`s. `.subscribe()` still works, but they are no longer RxJS observables, so `.pipe()` is not available (e.g. `CrisprControlComponent.valueChanges`). Use `outputToObservable()` if you need operators.
- Template-read state that used to be plain fields is now signals: `FormGroupListComponent.blockValue` and `selectedIndex`, and `SelectFieldComponent.allSelected`.
- Works in zoneless apps (`provideZonelessChangeDetection()`) as well as zone-based ones.
- `MapFieldComponent` passes the `GoogleMap` component to the `markers` callback on initialisation, matching its declared type and what `onMove` already receives.
- All standalone pieces, including the `ui/*` field components, are exported from the package entry point.
- Peer dependencies now match what the package is built with: Angular (`common`, `core`, `forms`, `material`, `cdk`) `^21.0.0`, up from the stale `^18.0.0`, and `@tft/form-validation-handler` `^21.1.0`, since it imports its standalone directives.
