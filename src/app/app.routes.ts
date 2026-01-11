import { Routes } from '@angular/router';
import { accountResolver } from './accounts/account/account-resolver';

export const routes: Routes = [
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'accounts',
    loadComponent: () => import('./accounts/accounts').then((m) => m.Accounts),
  },
  {
    path: 'accounts/:id',
    loadComponent: () => import('./accounts/account/account').then((m) => m.Account),
    resolve: {
      account: accountResolver,
    },
  },
  {
    path: 'categories',
    loadComponent: () => import('./categories/categories').then((m) => m.Categories),
  },
];
