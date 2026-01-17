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
import { CfoDashboardComponent } from '../approval/cfo-dashboard/cfo-dashboard.component';
import { PerDiemComponent } from '../per-diem/perdiem-create/per-diem.component';
import { PerdiemEditComponent } from '../per-diem/perdiem-edit/perdiem-edit.component';
import { PerdiemListComponent } from '../per-diem/perdiem-list/perdiem-list.component';
import { PerdiemDetailComponent } from '../per-diem/perdiem-detail/perdiem-detail.component';
import { TravelLandingComponent } from './travel-landing/travel-landing.component';
import { AppListComponent } from '../approval/app-role/app-list/app-list.component';
import { AppDetailComponent } from '../approval/app-role/app-detail/app-detail.component';
import { AppCreateComponent } from '../approval/app-role/app-create/app-create.component';
import { AppEditComponent } from '../approval/app-role/app-edit/app-edit.component';
import { UserListComponent } from '../approval/user-role/user-list/user-list.component';
import { UserDetailComponent } from '../approval/user-role/user-detail/user-detail.component';
import { UserCreateComponent } from '../approval/user-role/user-create/user-create.component';
import { UserEditComponent } from '../approval/user-role/user-edit/user-edit.component';
import { UserAccountComponent } from '../approval/user-role/user-account/user-account.component';

export const travelRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' }, // Default to create
  { path: 'create', component: TravelCreateComponent },
  { path: 'edit/:id', component: TravelEditComponent },
  { path: 'detail/:id', component: TravelDetailComponent },
  { path: 'list', component: TravelListComponent },
  { path: 'landing', component: TravelLandingComponent},

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
        { path: 'edit/:id', component: PerdiemEditComponent},
      ]},
    {
      path: 'cfo',
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: CfoListComponent },
        { path: 'detail/:id', component: CfoDetailComponent },
        { path: 'dashboard', component: CfoDashboardComponent },
      ]},
    {
      path: 'app',
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: AppListComponent  },
        { path: 'detail/:id', component: AppDetailComponent },
        { path: 'create', component: AppCreateComponent },
        { path: 'edit/:id', component: AppEditComponent},
      ]},
    {
      path: 'user',
      children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: UserListComponent },
        { path: 'detail/:id', component: UserDetailComponent },
        { path: 'create', component: UserCreateComponent },
        { path: 'account', component: UserAccountComponent },
        { path: 'edit/:id', component: UserEditComponent},
      ]},
      
];
