import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TravelListComponent } from './travel-list/travel-list.component';
import { TravelCreateComponent } from './travel-create/travel-create.component';
import { TravelEditComponent } from './travel-edit/travel-edit.component';
import { TravelDetailComponent } from './travel-detail/travel-detail.component';

const routes: Routes = [
  { path: '', component: TravelListComponent },
  { path: 'create', component: TravelCreateComponent },
  { path: 'edit/:id', component: TravelEditComponent },
  { path: 'detail/:id', component: TravelDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelRoutingModule { }

