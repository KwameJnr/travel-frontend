// travel.routes.ts
import { Routes } from '@angular/router';
import { TravelListComponent } from './travel-list/travel-list.component';
import { TravelCreateComponent } from './travel-create/travel-create.component';
import { TravelEditComponent } from './travel-edit/travel-edit.component';
import { TravelDetailComponent } from './travel-detail/travel-detail.component';

import { BuheadDetailComponent } from '../bu-head/buhead-detail/buhead-detail.component';
import { BuheadListComponent } from '../bu-head/bu-head-request-list/bu-head-request-list.component';

export const travelRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to create
  { path: 'create', component: TravelCreateComponent },
  { path: 'edit/:id', component: TravelEditComponent },
  { path: 'detail/:id', component: TravelDetailComponent },
  { path: 'list', component: TravelListComponent },

  {
    path: 'buhead',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: BuheadListComponent },
      { path: 'detail/:id', component: BuheadDetailComponent },
    ]}
];
