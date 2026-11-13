import { Routes } from '@angular/router';

export const GESTURES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pinch-to-zoom' },
  {
    path: 'pinch-to-zoom',
    loadComponent: () =>
      import('./pinch-to-zoom/pinch-to-zoom.component').then(
        (m) => m.PinchToZoomComponent
      ),
  },
];
