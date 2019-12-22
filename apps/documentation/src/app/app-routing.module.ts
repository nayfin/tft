import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: ''    , redirectTo: 'crispr-forms-demo', pathMatch: 'full'},
  {
    path: 'crispr-forms-demo',
    loadChildren: () => import('./crispr-forms-demo/crispr-forms-demo.module')
      .then(m => m.CrisprFormsDemoModule)
  },
  { path: '**'  , redirectTo: 'crispr-forms-demo' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
