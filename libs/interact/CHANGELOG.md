# Changelog

## 21.2.0

Angular modernization: standalone, signals, zoneless-ready and `strictTemplates`-clean.

### Added
- `provideInteract(config?)`: standalone replacement for `InteractModule.forRoot()`. Add it to your application or route providers.
- `InteractService` is exported from the package entry point.

### Deprecated
- `InteractModule` (including `forRoot()`) is deprecated. It still works, but it will be removed in the next major version. Import the standalone directives and pipe directly, and use `provideInteract()` for configuration.

### Changed
- Inputs, outputs and view queries are signal-based. Template bindings work as before. Code that set an input directly (`instance.foo = x`) must use `ComponentRef.setInput()` instead.
- Outputs are `OutputEmitterRef`s. `.subscribe()` still works, but `.pipe()` is not available. Use `outputToObservable()` if you need operators.
- Works in zoneless apps (`provideZonelessChangeDetection()`) as well as zone-based ones.
