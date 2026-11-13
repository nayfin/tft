import { Routes } from '@angular/router';

export const CRISPR_FORMS_DEMO_ROUTES: Routes = [
  { path: '', redirectTo: 'fields/map', pathMatch: 'full' },
  {
    path: 'overview',
    loadComponent: () =>
      import('./fields/overview/overview.component').then(
        (m) => m.OverviewComponent
      ),
  },
  {
    path: 'fields',
    loadChildren: () =>
      import('./fields/fields.routes').then((m) => m.FIELDS_ROUTES),
  },
  {
    path: 'features',
    loadChildren: () =>
      import('./features/features.routes').then((m) => m.FEATURES_ROUTES),
  },
];
