import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'drag'},
  {
    path: 'drag',
    loadChildren: () => import('./drag/drag.module').then(m => m.DragModule)
  },
  {
    path: 'gestures',
    loadChildren: () => import('./gestures/gestures.module').then(m => m.GesturesModule)
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FeaturesModule { }
