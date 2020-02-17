import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutocompleteDemoComponent } from './autocomplete-demo/autocomplete-demo.component';
import { FilterChiplistDemoComponent } from './filter-chiplist-demo/filter-chiplist-demo.component';


const routes: Routes = [
  { path: '', redirectTo: 'autocomplete', pathMatch: 'full' },
  { path: 'filter-chiplist', component: FilterChiplistDemoComponent },
  { path: 'autocomplete', component: AutocompleteDemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
