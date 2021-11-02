import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceholderTemplateComponent } from './placeholder-template/placeholder-template.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'placeholder-template'},
  { path: 'placeholder-template', component: PlaceholderTemplateComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DragRoutingModule { }
