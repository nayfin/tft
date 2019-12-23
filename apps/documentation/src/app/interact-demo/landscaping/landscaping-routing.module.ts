import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YardComponent } from './containers/yard/yard.component';


const routes: Routes = [
  { path: '', component: YardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandscapingRoutingModule { }
