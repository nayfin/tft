import { Routes } from '@angular/router';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';
import { INTERACT_ROOT_CONFIG, InteractService } from '@tft/interact';

export const routes: Routes = [
  { path: '', redirectTo: 'crispr-forms-demo', pathMatch: 'full' },
  {
    path: 'crispr-forms-demo',
    providers: [{ provide: MAT_DATE_LOCALE, useValue: enUS }],
    loadChildren: () =>
      import('./crispr-forms-demo/crispr-forms-demo.routes').then(
        (m) => m.CRISPR_FORMS_DEMO_ROUTES
      ),
  },
  {
    path: 'interact-demo',
    // scoped to the interact demo, replaces InteractModule.forRoot({ cssDimensionUnit: 'em' })
    providers: [
      { provide: INTERACT_ROOT_CONFIG, useValue: { cssDimensionUnit: 'em' } },
      InteractService,
    ],
    loadChildren: () =>
      import('./interact-demo/interact-demo.routes').then(
        (m) => m.INTERACT_DEMO_ROUTES
      ),
  },
  // {
  //   path: 'mat-instantsearch-demo',
  //   loadChildren: () => import('./mat-instantsearch-demo/mat-instantsearch-demo.routes')
  //     .then(m => m.MAT_INSTANTSEARCH_DEMO_ROUTES)
  // },
  { path: '**', redirectTo: 'crispr-forms-demo' },
];
