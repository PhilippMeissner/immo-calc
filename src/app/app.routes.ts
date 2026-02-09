import { Routes } from '@angular/router';
import { Calculator } from './components/calculator/calculator';

export const routes: Routes = [
  { path: '', component: Calculator },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./pages/impressum/impressum').then((m) => m.Impressum),
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./pages/datenschutz/datenschutz').then((m) => m.Datenschutz),
  },
  { path: '**', redirectTo: '' },
];
