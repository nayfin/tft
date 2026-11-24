#Creating a new crispr field

## Create component

- Generate component
  `ng g c <optional-directory/some-field> --project=crispr-forms`
- export it from `index.ts`, and from `src/lib/ui/public-api.ts` as a type only (`export type { SomeFieldComponent } from './some-field';`). A value export makes the entry point reach the component statically and defeats lazy loading (lint fails). Also add the folder to the `no-restricted-syntax` list in `libs/crispr-forms/.eslintrc.json`
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
