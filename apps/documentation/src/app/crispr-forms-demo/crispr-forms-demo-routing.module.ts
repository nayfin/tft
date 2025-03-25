import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './fields';


const routes: Routes = [
  { path: '', redirectTo: 'fields/map', pathMatch: 'full'},
  { path: 'overview', component: OverviewComponent},
  {
    path: 'fields',
    loadChildren: () => import('./fields/fields.module').then(m => m.FieldsModule)
  },
  {
    path: 'features',
    loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrisprFormsDemoRoutingModule { }
