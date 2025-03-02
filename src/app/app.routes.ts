import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [() => {
      const isLoggedIn = localStorage.getItem('token') !== null;
      return !isLoggedIn ? true : ['/dashboard'];
    }]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'fee-info',
    loadComponent: () => import('./pages/fee-info/fee-info.component').then(m => m.FeeInfoComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];
