import { Routes } from '@angular/router';
import { PerdiemListComponent } from 'src/app/per-diem/perdiem-list/perdiem-list.component';
import { PerdiemDetailComponent } from 'src/app/per-diem/perdiem-detail/perdiem-detail.component';
import { PerDiemComponent } from 'src/app/per-diem/perdiem-create/per-diem.component';

export const perdiemRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PerdiemListComponent },
  { path: 'detail/:id', component: PerdiemDetailComponent },
  { path: 'create', component: PerDiemComponent },
  { path: 'edit/:id', component: PerDiemComponent },
];

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class PerDiemRoutingModule { }
