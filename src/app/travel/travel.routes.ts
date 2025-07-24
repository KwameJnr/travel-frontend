// travel.routes.ts
import { Routes } from '@angular/router';
import { TravelListComponent } from './travel-list/travel-list.component';
import { TravelCreateComponent } from './travel-create/travel-create.component';
import { TravelEditComponent } from './travel-edit/travel-edit.component';
import { TravelDetailComponent } from './travel-detail/travel-detail.component';

import { BuheadDetailComponent } from '../bu-head/buhead-detail/buhead-detail.component';
import { BuheadListComponent } from '../bu-head/bu-head-request-list/bu-head-request-list.component';

import { CfoListComponent } from '../approval/cfo-list/cfo-list.component';
import { CfoDetailComponent } from '../approval/cfo-detail/cfo-detail.component';
import { BuheadCreateComponent } from '../bu-head/buhead-create/buhead-create.component';
import { BuheadEditComponent } from '../bu-head/buhead-edit/buhead-edit.component';
import { LoginComponent } from '../auth/login/login.component';
import { CfoDashboardComponent } from '../approval/cfo-dashboard/cfo-dashboard.component';
import { PerDiemComponent } from '../per-diem/perdiem-create/per-diem.component';
import { PerdiemListComponent } from '../per-diem/perdiem-list/perdiem-list.component';
import { PerdiemDetailComponent } from '../per-diem/perdiem-detail/perdiem-detail.component';

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
      { path: 'create', component: BuheadCreateComponent },
      { path: 'edit/:id', component: BuheadEditComponent},
    ]},

    {
      path: 'perdiem',
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: PerdiemListComponent },
        { path: 'detail/:id', component: PerdiemDetailComponent },
        { path: 'create', component: PerDiemComponent },
        { path: 'edit/:id', component: PerDiemComponent},
      ]},
    {
      path: 'cfo',
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: CfoListComponent },
        { path: 'detail/:id', component: CfoDetailComponent },
        { path: 'dashboard', component: CfoDashboardComponent },
      ]},
];
