import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComputedFieldComponent, DisabledFieldComponent } from '.';


const routes: Routes = [
  { path: 'computed-field', component: ComputedFieldComponent},
  { path: 'disabled-field', component: DisabledFieldComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
