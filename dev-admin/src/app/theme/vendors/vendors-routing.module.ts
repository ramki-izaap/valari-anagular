import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Vendors',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './vendors-list/vendors-list.module#VendorsListModule'
      },
      {
        path: 'list',
        loadChildren: './vendors-list/vendors-list.module#VendorsListModule'
      },
      {
        path: 'add',
        loadChildren: './vendors-add/vendors-add.module#VendorsAddModule'
      },
      {
        path: 'edit',
        loadChildren: './vendors-add/vendors-add.module#VendorsAddModule'
      },
      {
        path: 'view',
        loadChildren: './vendors-view/vendors-view.module#VendorsViewModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
