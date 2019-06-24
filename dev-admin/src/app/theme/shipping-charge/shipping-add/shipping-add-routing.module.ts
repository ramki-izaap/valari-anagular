import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingAddComponent } from './shipping-add.component';

const routes: Routes = [
  {
    path: '',
    component: ShippingAddComponent,
    data: {
      title: 'Add',
      icon: 'icon-user',
      caption: 'Create/Update Shipping Charge.',
      status: true
    }
  },
  {
    path: ':id',
    component: ShippingAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingAddRoutingModule { }
