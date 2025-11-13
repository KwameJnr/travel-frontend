import { Routes } from '@angular/router';
import { CfoListComponent } from 'src/app/approval/cfo-list/cfo-list.component';
import { CfoDetailComponent } from 'src/app/approval/cfo-detail/cfo-detail.component';
import { CfoDashboardComponent } from 'src/app/approval/cfo-dashboard/cfo-dashboard.component';

export const approvalRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: CfoListComponent },
  { path: 'detail/:id', component: CfoDetailComponent },
  { path: 'dashboard', component: CfoDashboardComponent },
];


// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class ApprovalRoutingModule { }
