import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
  },
];
