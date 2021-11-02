import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PinchToZoomComponent } from './pinch-to-zoom/pinch-to-zoom.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pinch-to-zoom'},
  { path: 'pinch-to-zoom', component: PinchToZoomComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GesturesRoutingModule { }
