# Changelog

## 21.6.0

### Added
- `compressionTimeoutMs` on the `IMAGE_UPLOAD` field: how long a selected image may take to process before the field gives up (default `30000` ms, `0` disables it). On timeout the compression is aborted and the field goes to `failed` with the message `Compressing "<name>" took too long. Please try again or choose a smaller image.`, under the same `imageProcessingFailed` error key as any other failure. A late result of the timed-out compression is ignored, and selecting another image works as usual.
- `processingState` signal on `<crispr-form>`: the aggregate processing state of all its image upload fields (sub-groups and group list items included), `'idle' | 'processing' | 'failed'`. A form without image fields is `'idle'`. Use it to disable a Save button outside the form, instead of wiring the `processingStateChange` callback into every image field's config (that callback still exists and is unchanged).
- `processingStateChange` output on `<crispr-form>`: emits the new `processingState` when it changes. It does not emit the initial `'idle'`, and changes within one change detection tick are coalesced. `submitted` is not blocked while an image is processing.
- `getProcessingState(control)` is exported, for forms built without `<crispr-form>`. It walks the control tree for the `imageProcessing` and `imageProcessingFailed` errors, skipping disabled controls.

### Fixed
- A required image upload showed "This field is required" while an image compressed or after it failed, because its processing error was added after the config's validators and the error display shows the first error. The processing error now comes first, so the field shows "Please wait while the image is processed", then the failure message. After the field is cleared `required` shows again.
- Selecting a file marks the image upload control as touched before it is cleared, so the processing error shows at once, also on a field the user had not touched.

### Changed (may need code updates)
- Image processing now times out after 30 seconds by default (`compressionTimeoutMs`). A compression that took longer used to finish, and now fails with the "took too long" message. Raise `compressionTimeoutMs`, or set it to `0`, to keep the old behaviour.

## 21.5.0

### Added
- `showInvalidErrors` on `FormConfig`, with the `InvalidErrorsConfig` type. It is off by default. With `true` (or an object), submitting an invalid form, from the submit button or `triggerSubmit()`, opens one Angular Material snack bar. It has a "Fix N field(s) to continue" heading, lists the invalid fields as `label: message`, shows "+N more" past `maxErrors` and has a Dismiss button. `InvalidErrorsConfig` sets `duration` (ms, default `8000`, `0` keeps it open until dismissed), `maxErrors` (default `5`) and `dismissLabel` (default `'Dismiss'`). Only one snack bar is open at a time, so a second invalid submit replaces the first. It does not move focus.
- `invalidFields` signal on `<crispr-form>`: what is wrong right now, one `InvalidField` per invalid field in config order, whether or not the fields have been touched. It keeps the same array while nothing observable has changed.
- `invalidSubmit` output on `<crispr-form>`: emits the same array when the form is submitted while invalid. `submitted` is unchanged and still fires for every submit.
- `getInvalidFields(config, group, errorDictionary?)` and the `InvalidField` type (`{ path, label, message, errorKey, control }`) are exported, for lists built outside `<crispr-form>`. Fields are named by `label`, else `heading.label`, else `controlName`, and fields inside sub-groups and group lists as `Street in Address` or `Photo in Photos 2` (`itemLabelBuilder` is used for list items when set). A group's own validator error is listed only when none of its fields are. Messages prefer the form's `errorDictionary` over the defaults.
- `@tft/crispr-forms-testing`: `testRadioField` (picked up by `testForm` and `testField`) and the `getRadioGroup`, `getRadioOption` and `selectRadioOption` helpers.
- Optional `label` on the `RADIO` field. It is shown above the radio group and is the group's accessible name (`aria-labelledby`). A radio with only a `heading` is named from the heading's text (`aria-label`), so existing radios get an accessible name without a config change. `heading` still captions the group as before.

### Fixed
- The `RADIO` field's validation error is shown under its radio group. It was rendered at the end of the form, outside the field (it could overlap the form's last button), and `getError(page, id, 'radio')` from `@tft/crispr-forms-testing` could not find it. The radio group now keeps 16px of space below its options, so the error sits clear of them instead of overlapping, and the content below does not jump when an error appears.

### Changed (may need code updates)
- `@tft/crispr-forms` now requires `@tft/form-validation-handler` `^21.2.0` (it was `^21.1.0`), which exports the `getErrorMessage` it uses. Update both packages together.

## 21.4.0

### Changed (may need code updates)
- The `UNIT_CONVERSION` field now passes the stored value to `initialDisplayValueConversion` unchanged. A stored `0` used to arrive as `null`, so the two could not be told apart. It now arrives as `0`, and only a missing value arrives as `null`. A conversion that treats a falsy `value` as "no measurement" (for example `value ? convert(value) : 0`) now gets `0` for a stored `0` and should check `value == null` instead.
- `storedValueConversion` and `initialDisplayValueConversion` on the `UNIT_CONVERSION` field may now return `null` as well as a number. Return `null` from both for an empty measurement and the field stays `null` on load, so a `required` field is invalid until the user enters a value. Existing configs that return a number keep compiling and behave as before.

## 21.3.0

### Added
- `clearable` and `clearButtonLabel` on the `DATEPICKER` field. With `clearable: true`, a small text button (no icon) appears next to the calendar toggle while the control has a value and is enabled. Clicking it sets the value to `null` and marks the control dirty and touched, so a required field shows its required error. `clearButtonLabel` sets the button's visible text (default `'Clear'`). Both are off by default, so existing forms are unchanged.
- `CrisprControlComponent` exposes `controlValue` and `controlEnabled` signals next to `controlValid` and `controlTouched`. They follow the control when the form changes it from outside the template.
- `@tft/crispr-forms-testing`: `testDatepickerField` covers clearable datepickers, with new `enterDatepickerDate` and `getDatepickerClearButton` helpers.
- `@tft/crispr-forms-testing`: `testDatepickerField` also checks the `cellClassFunction` and `dateClass` options by comparing every day of an open calendar with the classes the config returns, with new `openDatepickerCalendar`, `closeDatepickerCalendar` and `getCalendarDayClasses` helpers.

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
