import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'travel/create',
    pathMatch: 'full'
  },
  {
    path: 'travel',
    loadChildren: () =>
      import('./travel/travel.routes').then(m => m.travelRoutes)
  },
  {
    path: '**',
    redirectTo: 'travel/create'
  },
];

