import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/login/guards/auth.guard';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent, 
    canActivate: [authGuard],  // ✅ PROTECT ALL CHILD ROUTES
    children: [
      {
        path: 'travel',
        loadChildren: () =>
          import('./travel/travel.routes').then((m) => m.travelRoutes),
      },
      {
        path: '',
        redirectTo: 'travel/create',
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
    redirectTo: 'travel/create',
  },
];
