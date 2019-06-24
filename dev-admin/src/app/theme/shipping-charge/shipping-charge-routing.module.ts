import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
 
  {
    path: '',
    data: {
      title: 'Shipping Charge',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './shipping-list/shipping-list.module#ShippingListModule'
      },
      {
        path: 'list',
        loadChildren: './shipping-list/shipping-list.module#ShippingListModule'
      },
      {
        path: 'add',
        loadChildren: './shipping-add/shipping-add.module#ShippingAddModule'
      },
      {
        path: 'edit',
        loadChildren: './shipping-add/shipping-add.module#ShippingAddModule'
      }
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingChargeRoutingModule { }
