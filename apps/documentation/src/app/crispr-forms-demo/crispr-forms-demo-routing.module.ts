import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './containers/overview/overview.component';


const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full'},
  { path: 'overview', component: OverviewComponent},
  { path: '**', redirectTo: 'overview'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  // declarations: [OverviewComponent]
})
export class CrisprFormsDemoRoutingModule { }
