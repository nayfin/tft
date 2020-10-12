import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InteractModule } from '@tft/interact'
import { AlternateDragContainerComponent } from './alternate-drag-container/alternate-drag-container.component';

const routes: Routes = [
  { path: '', redirectTo: 'alternate-drag-container'},
  { path: 'alternate-drag-container', component: AlternateDragContainerComponent }
];


@NgModule({
  declarations: [
    AlternateDragContainerComponent
  ],
  imports: [
    CommonModule,
    InteractModule,
    RouterModule.forChild(routes)
  ]
})
export class FeaturesModule { }
