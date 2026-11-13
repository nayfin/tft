import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NgAisModule } from 'angular-instantsearch';

export const MAT_INSTANTSEARCH_DEMO_ROUTES: Routes = [
  {
    path: '',
    providers: [importProvidersFrom(NgAisModule.forRoot())],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'components',
        loadChildren: () =>
          import('./components/components.routes').then(
            (m) => m.COMPONENTS_ROUTES
          ),
      },
    ],
  },
];
