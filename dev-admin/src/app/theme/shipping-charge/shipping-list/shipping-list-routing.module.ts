import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingListComponent } from '../shipping-list/shipping-list.component';
const routes: Routes = [
  {
    path: '',
    component: ShippingListComponent,
    data: {
      title: 'Shipping Charge List',
      icon: 'icon-user',
      caption: 'Manage Shipping Charge.',
      status: true
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingListRoutingModule { }
