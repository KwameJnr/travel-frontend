import { Routes } from '@angular/router';
import { BuheadListComponent } from 'src/app/bu-head/bu-head-request-list/bu-head-request-list.component';
import { BuheadDetailComponent } from 'src/app/bu-head/buhead-detail/buhead-detail.component';
import { BuheadCreateComponent } from 'src/app/bu-head/buhead-create/buhead-create.component';
import { BuheadEditComponent } from 'src/app/bu-head/buhead-edit/buhead-edit.component';

export const buheadRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: BuheadListComponent },
  { path: 'detail/:id', component: BuheadDetailComponent },
  { path: 'create', component: BuheadCreateComponent },
  { path: 'edit/:id', component: BuheadEditComponent },
];


// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class BuHeadRoutingModule { }
