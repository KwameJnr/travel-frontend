import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/login/guards/auth.guard';
import { LoginGuard } from './auth/login/guards/login.guard';

export const appRoutes: Routes = [
  // ===== LOGIN =====
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard] 
  },

  // ===== MAIN APP LAYOUT =====
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'travel',
        loadChildren: () =>
          import('./travel/travel.routes').then(m => m.travelRoutes),
        canActivate: [authGuard], // protects all child routes
      },
      {
        path: '',
        redirectTo: 'login', // redirect empty path to login
        pathMatch: 'full',
      },
    ],
  },

  // ===== UNAUTHORIZED PAGE =====
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('app/auth/login/unauthorized/unauthorized.component').then(
        m => m.UnauthorizedComponent
      ),
  },

  // ===== CATCH ALL =====
  {
    path: '**',
    redirectTo: 'login',
  },
];