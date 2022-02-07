#Creating a new crispr field

## Create component

- Generate component
  `ng g c <optional-directory/some-field> --project=crispr-forms`
- export it from `index.ts`
- create corresponding config in models folder <some-field.config.ts>
- export new config from `models/index.ts`
- in `crispr-field.config.ts`
  - add new config to `AnyFieldConfig`
  - add entry to `ControlType`
- in `field-component-map.const.ts`
  - add component class to `FIELD_COMPONENTS` and `CrisprControlComponent`

## Create demo example

- Generate demo component
`ng g c crispr-forms-demo/fields/<field-name> --project=documentation`
- Add route to `fields-routing.module.ts`
- Add to sidenav config in `app-nav-tree.ts`
