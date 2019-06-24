import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Purchase',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './list/purchaseorder-list.module#PurchaseListModule'
      },
      {
        path: 'list',
        loadChildren: './list/purchaseorder-list.module#PurchaseListModule'
      },
      {
        path: 'view',
        loadChildren: './view/purchaseorder-view.module#PurchaseViewModule'
      },
      {
        path: 'create',
        loadChildren: './create/purchaseorder-create.module#PurchaseCreateModule'
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
