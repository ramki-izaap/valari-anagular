import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponsListComponent } from '../coupons-list/coupons-list.component';
const routes: Routes = [{
    path: '',
    component: CouponsListComponent,
    data: {
      title: 'List',
      icon: 'icon-user',
      caption: 'Coupons List.',
      status: true
    }
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsListRoutingModule { }
