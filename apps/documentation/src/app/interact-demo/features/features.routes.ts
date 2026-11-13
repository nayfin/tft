import { Routes } from '@angular/router';

export const INTERACT_FEATURES_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'drag' },
  {
    path: 'drag',
    loadChildren: () => import('./drag/drag.routes').then((m) => m.DRAG_ROUTES),
  },
  {
    path: 'resize',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'basics' },
      {
        path: 'basics',
        loadComponent: () =>
          import('./resize/basics/basics.component').then(
            (m) => m.ResizeBasicsComponent
          ),
      },
    ],
  },
  {
    path: 'scale',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'basics' },
      {
        path: 'basics',
        loadComponent: () =>
          import('./scale/basics/basics.component').then(
            (m) => m.ScaleBasicsComponent
          ),
      },
    ],
  },
  {
    path: 'gestures',
    loadChildren: () =>
      import('./gestures/gestures.routes').then((m) => m.GESTURES_ROUTES),
  },
];
