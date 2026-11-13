import { Routes } from '@angular/router';

export const FEATURES_ROUTES: Routes = [
  {
    path: 'computed-field',
    loadComponent: () =>
      import('./computed-field/computed-field.component').then(
        (m) => m.ComputedFieldComponent
      ),
  },
  {
    path: 'disabled-field',
    loadComponent: () =>
      import('./disabled-field/disabled-field.component').then(
        (m) => m.DisabledFieldComponent
      ),
  },
  {
    path: 'appearance',
    loadComponent: () =>
      import('./appearance/appearance.component').then(
        (m) => m.AppearanceComponent
      ),
  },
  {
    path: 'color',
    loadComponent: () =>
      import('./color/color.component').then((m) => m.ColorComponent),
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./info/info.component').then((m) => m.InfoComponent),
  },
  {
    path: 'suffix',
    loadComponent: () =>
      import('./suffix/suffix.component').then((m) => m.SuffixComponent),
  },
  {
    path: 'custom-component',
    loadComponent: () =>
      import('./custom-component/custom-component.component').then(
        (m) => m.CustomComponentComponent
      ),
  },
  {
    path: 'validators',
    loadComponent: () =>
      import('./validators/validators.component').then(
        (m) => m.ValidatorsComponent
      ),
  },
];
