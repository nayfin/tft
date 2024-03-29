import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComputedFieldComponent } from './computed-field/computed-field.component';
import { DisabledFieldComponent } from './disabled-field/disabled-field.component';
import { AppearanceComponent } from './appearance/appearance.component';
import { ColorComponent } from './color/color.component';
import { InfoComponent } from './info/info.component';
import { SuffixComponent } from './suffix/suffix.component';
import { CustomComponentComponent } from './custom-component/custom-component.component';
import { ValidatorsComponent } from './validators/validators.component';


const routes: Routes = [
  { path: 'computed-field', component: ComputedFieldComponent},
  { path: 'disabled-field', component: DisabledFieldComponent},
  { path: 'appearance', component: AppearanceComponent},
  { path: 'color', component: ColorComponent},
  { path: 'info', component: InfoComponent},
  { path: 'suffix', component: SuffixComponent},
  { path: 'custom-component', component: CustomComponentComponent},
  { path: 'validators', component: ValidatorsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
