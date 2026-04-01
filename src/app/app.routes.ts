import { Routes } from '@angular/router';

// TODO [CONCEPT: Routing]
// Angular Router maps URL paths to components.
// 'canActivate' is a route guard — protects routes from unauthorized access.
// 'redirectTo' handles default/fallback navigation.
// Lazy loading with loadComponent() loads components only when needed (performance).
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [() => !!localStorage.getItem('user')], // TODO [CONCEPT: Route Guard] — simple auth guard
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' } // wildcard route
];
