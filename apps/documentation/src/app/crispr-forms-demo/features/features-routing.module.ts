import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComputedFieldComponent, DisabledFieldComponent } from '.';
import { AppearanceComponent } from './appearance/appearance.component';
import { ColorComponent } from './color/color.component';
import { InfoComponent } from './info/info.component';
import { SuffixComponent } from './suffix/suffix.component';


const routes: Routes = [
  { path: 'computed-field', component: ComputedFieldComponent},
  { path: 'disabled-field', component: DisabledFieldComponent},
  { path: 'appearance', component: AppearanceComponent},
  { path: 'color', component: ColorComponent},
  { path: 'info', component: InfoComponent},
  { path: 'suffix', component: SuffixComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
