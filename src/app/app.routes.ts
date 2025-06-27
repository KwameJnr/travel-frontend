// app.routes.ts
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
  }
];









// import { Routes } from '@angular/router';
// import { provideRouter } from '@angular/router';
// import { TravelListComponent } from './travel/travel-list/travel-list.component';

// export const appRoutes: Routes = [
//   { path: '', redirectTo: 'travel/travel-create', pathMatch: 'full' }, // 👈 Redirect root to travel/create
//   {
//     path: 'travel',
//     loadChildren: () =>
//       import('./travel/travel-routing.module').then(m => m.TravelRoutingModule)
//   },
//   // Optional: Catch-all for unknown routes
//   { path: '**', redirectTo: 'travel/travel-create' }
// ];
