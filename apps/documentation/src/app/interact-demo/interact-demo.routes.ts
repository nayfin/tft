import { Routes } from '@angular/router';

export const INTERACT_DEMO_ROUTES: Routes = [
  { path: '', redirectTo: 'shuffleboard', pathMatch: 'full' },
  {
    path: 'shuffleboard',
    loadComponent: () =>
      import('./shuffleboard/containers/game/game.component').then(
        (m) => m.GameComponent
      ),
  },
  {
    path: 'features',
    loadChildren: () =>
      import('./features/features.routes').then(
        (m) => m.INTERACT_FEATURES_ROUTES
      ),
  },
  {
    path: 'landscaping',
    loadComponent: () =>
      import('./landscaping/containers/yard/yard.component').then(
        (m) => m.YardComponent
      ),
  },
];
