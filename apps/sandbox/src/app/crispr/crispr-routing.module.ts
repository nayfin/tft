import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './containers/demo/demo.component';


const routes: Routes = [
  { path: '', redirectTo: 'crispr' },
  { path: 'crispr', component: DemoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrisprRoutingModule { }
