import { Routes } from '@angular/router';
import { PerdiemListComponent } from 'src/app/per-diem/perdiem-list/perdiem-list.component';
import { PerdiemDetailComponent } from 'src/app/per-diem/perdiem-detail/perdiem-detail.component';
import { PerDiemComponent } from 'src/app/per-diem/perdiem-create/per-diem.component';
import { PerdiemEditComponent } from 'src/app/per-diem/perdiem-edit/perdiem-edit.component';


export const perdiemRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: PerdiemListComponent },
  { path: 'detail/:id', component: PerdiemDetailComponent },
  { path: 'create', component: PerDiemComponent },
  { path: 'edit/:id', component: PerdiemEditComponent },
];
