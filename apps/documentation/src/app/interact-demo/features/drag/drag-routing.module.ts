import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DragBasicsComponent } from './basics/basics.component';
import { DragDropzonesComponent } from './dropzones/dropzones.component';
import { PlaceholderTemplateComponent } from './placeholder-template/placeholder-template.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'basics' },
  { path: 'basics', component: DragBasicsComponent },
  { path: 'dropzones', component: DragDropzonesComponent },
  { path: 'placeholder-template', component: PlaceholderTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DragRoutingModule {}
