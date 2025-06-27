import { Routes } from '@angular/router';

const routes: Routes = [
    { path: 'travels', loadChildren: () => import('./travel/travel.module').then(m => m.TravelModule) },
    { path: '', redirectTo: '/travels', pathMatch: 'full' },
  ];
  