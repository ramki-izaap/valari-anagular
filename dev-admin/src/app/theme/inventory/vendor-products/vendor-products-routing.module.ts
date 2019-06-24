import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Product',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './vendor-products-list/vendor-products-list.module#VendorProductsListModule'
      },
      {
        path: 'list',
        loadChildren: './vendor-products-list/vendor-products-list.module#VendorProductsListModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorProductsRoutingModule { }
