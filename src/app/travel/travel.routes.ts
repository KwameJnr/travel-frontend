// travel.routes.ts
import { Routes } from '@angular/router';

export const travelRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },

  // Travel main routes
  {
    path: 'create',
    loadComponent: () =>
      import('./travel-create/travel-create.component').then(m => m.TravelCreateComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./travel-edit/travel-edit.component').then(m => m.TravelEditComponent)
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./travel-detail/travel-detail.component').then(m => m.TravelDetailComponent)
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./travel-list/travel-list.component').then(m => m.TravelListComponent)
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./travel-landing/travel-landing.component').then(m => m.TravelLandingComponent)
  },

  // BU Head routes
  {
    path: 'buhead',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () =>
          import('../bu-head/bu-head-request-list/bu-head-request-list.component').then(m => m.BuheadListComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('../bu-head/buhead-detail/buhead-detail.component').then(m => m.BuheadDetailComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../bu-head/buhead-create/buhead-create.component').then(m => m.BuheadCreateComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('../bu-head/buhead-edit/buhead-edit.component').then(m => m.BuheadEditComponent)
      }
    ]
  },

  // Perdiem routes
  {
    path: 'perdiem',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () =>
          import('../per-diem/perdiem-list/perdiem-list.component').then(m => m.PerdiemListComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('../per-diem/perdiem-detail/perdiem-detail.component').then(m => m.PerdiemDetailComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../per-diem/perdiem-create/per-diem.component').then(m => m.PerDiemComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('../per-diem/perdiem-edit/perdiem-edit.component').then(m => m.PerdiemEditComponent)
      }
    ]
  },

  // CFO routes
  {
    path: 'cfo',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () =>
          import('../approval/cfo-list/cfo-list.component').then(m => m.CfoListComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('../approval/cfo-detail/cfo-detail.component').then(m => m.CfoDetailComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../approval/cfo-dashboard/cfo-dashboard.component').then(m => m.CfoDashboardComponent)
      }
    ]
  },

  // App routes
  {
    path: 'app',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () =>
          import('../approval/app-role/app-list/app-list.component').then(m => m.AppListComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('../approval/app-role/app-detail/app-detail.component').then(m => m.AppDetailComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../approval/app-role/app-create/app-create.component').then(m => m.AppCreateComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('../approval/app-role/app-edit/app-edit.component').then(m => m.AppEditComponent)
      }
    ]
  },

  // User routes
  {
    path: 'user',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadComponent: () =>
          import('../approval/user-role/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('../approval/user-role/user-detail/user-detail.component').then(m => m.UserDetailComponent)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../approval/user-role/user-create/user-create.component').then(m => m.UserCreateComponent)
      },
      {
        path: 'account',
        loadComponent: () =>
          import('../approval/user-role/user-account/user-account.component').then(m => m.UserAccountComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('../approval/user-role/user-edit/user-edit.component').then(m => m.UserEditComponent)
      }
    ]
  }
];


