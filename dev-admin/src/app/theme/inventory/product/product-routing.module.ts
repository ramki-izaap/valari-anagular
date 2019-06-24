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
        loadChildren: './product-list/product-list.module#ProductListModule'
      },
      {
        path: 'add',
        loadChildren: './product-add/product-add.module#ProductAddModule'
      },
      {
        path: 'view',
        loadChildren: './product-view/product-view.module#ProductViewModule'
      },
      {
        path: 'list',
        loadChildren: './product-list/product-list.module#ProductListModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
