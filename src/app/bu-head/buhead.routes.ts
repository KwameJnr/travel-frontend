import { Routes } from '@angular/router';
// import { BuHeadRequestListComponent } from './bu-head-request-list/bu-head-request-list.component';
import { BuheadDetailComponent } from './buhead-detail/buhead-detail.component';

// import { BuHeadHistoryComponent } from './bu-head-history/bu-head-history.component';

export const buHeadRoutes: Routes = [
  { path: '', redirectTo: 'requests', pathMatch: 'full' },
//   { path: 'requests', component: BuHeadRequestListComponent },
  { path: 'requests/:id', component: BuheadDetailComponent },
//   { path: 'details/:id', component: BuheadDetailComponent }
];
