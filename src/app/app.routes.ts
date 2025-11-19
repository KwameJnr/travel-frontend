import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/login/guards/auth.guard';
import { loginGuard } from './auth/login/guards/login.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [loginGuard],
  },
  {
    path: '',
    component: LayoutComponent, 
    // canActivate: [authGuard],  // ✅ PROTECT ALL CHILD ROUTES
    children: [
      {
        path: 'travel',
        loadChildren: () =>
          import('./travel/travel.routes').then((m) => m.travelRoutes),
      },
      {
        path: '',
        redirectTo: 'travel/list',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('app/auth/login/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'travel/list',
  },
];
