import { Routes } from '@angular/router';

export const DRAG_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'basics' },
  {
    path: 'basics',
    loadComponent: () =>
      import('./basics/basics.component').then((m) => m.DragBasicsComponent),
  },
  {
    path: 'dropzones',
    loadComponent: () =>
      import('./dropzones/dropzones.component').then(
        (m) => m.DragDropzonesComponent
      ),
  },
  {
    path: 'placeholder-template',
    loadComponent: () =>
      import('./placeholder-template/placeholder-template.component').then(
        (m) => m.PlaceholderTemplateComponent
      ),
  },
];
