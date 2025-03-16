import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AnnouncementBoardComponent } from './components/announcement-board/announcement-board.component';
import { RepairRequestFormComponent } from './components/repair-request-form/repair-request-form.component';
import { RepairRequestListComponent } from './components/repair-request-list/repair-request-list.component';
import { TableComponent } from './pages/table/table.component';
import { CarfeeextendComponent } from './pages/carfee/carfeeextend/carfeeextend.component';

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
    path: 'carfee',
    loadComponent: () => import('./pages/carfee/carfee.component').then(m => m.CarfeeComponent),
    canActivate: [AuthGuard],
    children: [
      { path: 'carfeeextend', component: CarfeeextendComponent },
    ]
  },
  {
    path: 'carfeeextend',
    loadComponent: () => import('./pages//carfee/carfeeextend/carfeeextend.component').then(m => m.CarfeeextendComponent),
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
  {
    path: 'resident-information',
    loadComponent: () => import('./pages/resident-information/resident-information.component').then(m => m.ResidentInformationComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'guest-login',
    loadComponent: () => import('./pages/guest-login/guest-login.component').then(m => m.GuestLoginComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];
