import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorProductsNewListComponent } from './vendor-products-new-list.component';
const routes: Routes = [{
  path: '',
    component: VendorProductsNewListComponent,
    data: {
      title: 'List',
      icon: 'icon-user',
      caption: 'Product List.',
      status: true
    }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorProductsNewListRoutingModule { }
