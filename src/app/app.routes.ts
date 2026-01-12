import { Routes } from '@angular/router';
import { accountResolver } from './accounts/account/account-resolver';
import { authGuard } from './auth/auth-guard';
import { guestGuard } from './auth/guest-guard';

export const routes: Routes = [
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
    canActivate: [guestGuard],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
  {
    path: 'accounts',
    loadComponent: () => import('./accounts/accounts').then((m) => m.Accounts),
    canActivate: [authGuard],
  },
  {
    path: 'accounts/:id',
    loadComponent: () => import('./accounts/account/account').then((m) => m.Account),
    canActivate: [authGuard],
    resolve: {
      account: accountResolver,
    },
  },
  {
    path: 'categories',
    loadComponent: () => import('./categories/categories').then((m) => m.Categories),
    canActivate: [authGuard],
  },
];
