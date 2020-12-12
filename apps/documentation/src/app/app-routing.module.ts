import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'crispr-forms-demo', pathMatch: 'full'},
  {
    path: 'crispr-forms-demo',
    loadChildren: () => import('./crispr-forms-demo/crispr-forms-demo.module')
      .then(m => m.CrisprFormsDemoModule)
  },
  {
    path: 'interact-demo',
    loadChildren: () => import('./interact-demo/interact-demo.module')
      .then(m => m.InteractDemoModule)
  },
  // {
  //   path: 'mat-instantsearch-demo',
  //   loadChildren: () => import('./mat-instantsearch-demo/mat-instantsearch-demo.module')
  //     .then(m => m.MatInstantsearchDemoModule)
  // },
  { path: '**'  , redirectTo: 'crispr-forms-demo' },
];
const routerConfig: ExtraOptions = {
    enableTracing: false,
    relativeLinkResolution: 'legacy'
}
@NgModule({
  imports: [
    RouterModule.forRoot(routes, routerConfig)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
