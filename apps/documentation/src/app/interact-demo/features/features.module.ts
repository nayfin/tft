import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InteractModule } from '@tft/interact'
import { PlaceholderTemplateComponent } from './placeholder-template/placeholder-template.component';

const routes: Routes = [
  { path: '', redirectTo: 'placeholder-template'},
  { path: 'placeholder-template', component: PlaceholderTemplateComponent }
];


@NgModule({
  declarations: [
    PlaceholderTemplateComponent
  ],
  imports: [
    CommonModule,
    InteractModule,
    RouterModule.forChild(routes)
  ]
})
export class FeaturesModule { }
