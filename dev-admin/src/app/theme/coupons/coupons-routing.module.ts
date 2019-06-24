import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
    path: '',
    data: {
      title: 'Coupons',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './coupons-list/coupons-list.module#CouponsListModule'
      },
      {
        path: 'list',
        loadChildren: './coupons-list/coupons-list.module#CouponsListModule'
      },
      {
        path: 'add',
        loadChildren: './coupons-add/coupons-add.module#CouponsAddModule'
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
