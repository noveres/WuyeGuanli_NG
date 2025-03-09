import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AnnouncementBoardComponent } from './components/announcement-board/announcement-board.component';
import { RepairRequestFormComponent } from './components/repair-request-form/repair-request-form.component';
import { RepairRequestListComponent } from './components/repair-request-list/repair-request-list.component';
import { TableComponent } from './pages/table/table.component';

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
    path: 'rental-info',
    loadComponent: () => import('./pages/rental-info/rental-info.component').then(m => m.RentalInfoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'fee-info',
    loadComponent: () => import('./pages/fee-info/fee-info.component').then(m => m.FeeInfoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'savetab',
    loadComponent: () => import('./pages/fee-info//savetab/savetab.component').then(m => m.SavetabComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'announcements',
    component: AnnouncementBoardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'repair-request',
    component: RepairRequestFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'repair-list',
    component: RepairRequestListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'repair-management',
    loadComponent: () => import('./pages/repair-management/repair-management.component').then(m => m.RepairManagementComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'financial',
    loadComponent: () => import('./pages/financial/table/table.component').then(m => m.TableComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];
