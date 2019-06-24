import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorProductsListComponent } from './vendor-products-list.component';

const routes: Routes = [
  {
    path: '',
    component: VendorProductsListComponent,
    data: {
      title: 'List',
      icon: 'icon-user',
      caption: 'Product List.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorProductsListRoutingModule { }
