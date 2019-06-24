import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { ShippingAddComponent } from './shipping-add/shipping-add.component';
import { ShippingListComponent } from './shipping-list/shipping-list.component';
import { ShippingChargeRoutingModule } from './shipping-charge-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ShippingChargeRoutingModule,
    SharedModule
  ],
  declarations: []
})
export class ShippingChargeModule { }
