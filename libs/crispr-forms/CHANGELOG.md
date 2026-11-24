# Changelog

## 21.2.0

### Fixed
- The field components are lazily loaded again, restoring the chunking of 21.0.x. 21.1.0 to 21.1.3 shipped one bundle that statically imported `@angular/google-maps`, `browser-image-compression` and `@angular/material-date-fns-adapter`. They are no longer part of the entry bundle.

### Changed (may need code updates)
- The field components (`InputFieldComponent`, `SelectFieldComponent`, `MapFieldComponent`, `OptionComponent`, and so on) and `FormGroupListComponent` are exported from the entry point as types only. `SubGroupComponent` and `SubGroupModule` are not exported. They were exported as values in 21.1.0 to 21.1.3, and the exports were reverted because they defeated lazy loading. Type uses such as `ComponentRef<InputFieldComponent>` keep working. `CrisprFormComponent`, `FieldContainerComponent`, the file upload, file dropzone, selected file, heading and info components, the directives and the pipes are still exported as values.

## 21.1.1

### Fixed
- Form group list with a `displayItemComponent`: opening an item for editing no longer opens the last item as well. When nothing is selected the last item is the one open for editing. Adding an item now opens the new item for editing, and deleting an item keeps the selection on the same item (or clears it if that item was deleted).
- A field hidden through `hideDisabled` no longer keeps its place in a flex or grid form. The field component's own element, and any `classes` set on it, used to stay in the layout and leave an empty slot and gap.
- Hints on the input, select, textarea, file upload, autocomplete, chiplist, datepicker and unit conversion fields now follow the control's state when the form changes it from outside the template (`markAsTouched`, `setErrors`, `patchValue`, an async validator finishing). `CrisprControlComponent` exposes this as the `controlValid`, `controlTouched` and `hintVisible` signals.
- The map field no longer has an unused `onSelectLocation` handler. The map was already recentred on the chosen location.

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
