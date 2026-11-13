import { Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { NgAisModule } from 'angular-instantsearch';

export const COMPONENTS_ROUTES: Routes = [
  {
    path: '',
    providers: [importProvidersFrom(NgAisModule.forRoot())],
    children: [
      { path: '', redirectTo: 'autocomplete', pathMatch: 'full' },
      {
        path: 'autocomplete',
        loadComponent: () =>
          import('./autocomplete-demo/autocomplete-demo.component').then(
            (m) => m.AutocompleteDemoComponent
          ),
      },
      {
        path: 'filter-chiplist',
        loadComponent: () =>
          import('./filter-chiplist-demo/filter-chiplist-demo.component').then(
            (m) => m.FilterChiplistDemoComponent
          ),
      },
      {
        path: 'filter-select',
        loadComponent: () =>
          import('./filter-select-demo/filter-select-demo.component').then(
            (m) => m.FilterSelectDemoComponent
          ),
      },
      {
        path: 'search-box',
        loadComponent: () =>
          import('./search-box-demo/search-box-demo.component').then(
            (m) => m.SearchBoxDemoComponent
          ),
      },
      {
        path: 'pagination',
        loadComponent: () =>
          import('./pagination-demo/pagination-demo.component').then(
            (m) => m.PaginationDemoComponent
          ),
      },
      { path: '**', redirectTo: 'autocomplete' },
    ],
  },
];
