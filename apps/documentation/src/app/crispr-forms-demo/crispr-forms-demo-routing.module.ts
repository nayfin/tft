import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectComponent, OverviewComponent, ComputedFieldComponent } from './containers';


const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full'},
  { path: 'overview', component: OverviewComponent},
  { path: 'select', component: SelectComponent},
  { path: 'computed-field', component: ComputedFieldComponent},
  { path: '**', redirectTo: 'overview'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrisprFormsDemoRoutingModule { }
