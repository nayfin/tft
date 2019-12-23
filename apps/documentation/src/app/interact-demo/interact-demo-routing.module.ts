import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', redirectTo: 'shuffleboard', pathMatch: 'full'},
  {
    path: 'shuffleboard',
    loadChildren: () => import('./shuffleboard/shuffleboard.module')
      .then(m => m.ShuffleboardModule)
  },
  {
    path: 'landscaping',
    loadChildren: () => import('./landscaping/landscaping.module')
      .then(m => m.LandscapingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InteractDemoRoutingModule { }
