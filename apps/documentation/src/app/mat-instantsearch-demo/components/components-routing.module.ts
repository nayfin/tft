import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutocompleteDemoComponent } from './autocomplete-demo/autocomplete-demo.component';
import { FilterChiplistDemoComponent } from './filter-chiplist-demo/filter-chiplist-demo.component';
import { FilterSelectDemoComponent } from './filter-select-demo/filter-select-demo.component';
import { SearchBoxDemoComponent } from './search-box-demo/search-box-demo.component';
import { PaginationDemoComponent } from './pagination-demo/pagination-demo.component';


const routes: Routes = [
  { path: '', redirectTo: 'autocomplete', pathMatch: 'full' },
  { path: 'autocomplete', component: AutocompleteDemoComponent },
  { path: 'filter-chiplist', component: FilterChiplistDemoComponent },
  { path: 'filter-select', component: FilterSelectDemoComponent },
  { path: 'search-box', component: SearchBoxDemoComponent },
  { path: 'pagination', component: PaginationDemoComponent },
  { path: '**', redirectTo: 'autocomplete' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
