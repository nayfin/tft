import { Routes } from '@angular/router';

export const FIELDS_ROUTES: Routes = [
  { path: '', redirectTo: 'select', pathMatch: 'full' },
  {
    path: 'select',
    loadComponent: () =>
      import('./select/select.component').then((m) => m.SelectComponent),
  },
  {
    path: 'autocomplete',
    loadComponent: () =>
      import('./autocomplete/autocomplete.component').then(
        (m) => m.AutocompleteComponent
      ),
  },
  {
    path: 'autocomplete-chiplist',
    loadComponent: () =>
      import('./autocomplete-chiplist/autocomplete-chiplist.component').then(
        (m) => m.AutocompleteChiplistComponent
      ),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./input/input.component').then((m) => m.InputComponent),
  },
  {
    path: 'textarea',
    loadComponent: () =>
      import('./textarea/textarea.component').then((m) => m.TextareaComponent),
  },
  {
    path: 'file-upload',
    loadComponent: () =>
      import('./file-upload/file-upload.component').then(
        (m) => m.FileUploadComponent
      ),
  },
  {
    path: 'image-upload',
    loadComponent: () =>
      import('./image-upload/image-upload.component').then(
        (m) => m.ImageUploadComponent
      ),
  },
  {
    path: 'group-list',
    loadComponent: () =>
      import('./group-list/group-list.component').then(
        (m) => m.GroupListComponent
      ),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./checkbox/checkbox.component').then((m) => m.CheckboxComponent),
  },
  {
    path: 'datepicker',
    loadComponent: () =>
      import('./datepicker/datepicker.component').then(
        (m) => m.DatepickerComponent
      ),
  },
  {
    path: 'slider',
    loadComponent: () =>
      import('./slider/slider.component').then((m) => m.SliderComponent),
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./map/map.component').then((m) => m.MapComponent),
  },
  {
    path: 'divider',
    loadComponent: () =>
      import('./divider/divider.component').then((m) => m.DividerComponent),
  },
  {
    path: 'heading',
    loadComponent: () =>
      import('./heading/heading.component').then((m) => m.HeadingComponent),
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./button/button.component').then((m) => m.ButtonComponent),
  },
  {
    path: 'unit-conversion',
    loadComponent: () =>
      import('./unit-conversion/unit-conversion.component').then(
        (m) => m.UnitConversionComponent
      ),
  },
  { path: '**', redirectTo: 'select' },
];
