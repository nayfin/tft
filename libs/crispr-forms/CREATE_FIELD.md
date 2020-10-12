

- Generate component
  `ng g c <optional-directory/some-field> --project=crispr-forms
- create corresponding config in models folder <some-field.config.ts>
- export new config from `models/index.ts`
- in `crispr-field.config.ts`
  - add new config to `AnyFieldConfig`
  - add entry to `ControlType`
-