import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'sales order',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './sales-order-list/sales-order-list.module#SalesOrderListModule'
      },
      {
        path: 'list',
        loadChildren: './sales-order-list/sales-order-list.module#SalesOrderListModule'
      },
      {
        path: 'view',
        loadChildren: './sales-order-view/sales-order-view.module#SalesOrderViewModule'
      }
      ,
      {
        path: 'create',
        loadChildren: './sales-order-create/sales-order-create.module#SalesOrderCreateModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderRoutingModule { }
