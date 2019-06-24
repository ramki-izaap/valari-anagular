import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { ShippingAddComponent } from './shipping-add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { ShippingAddRoutingModule } from './shipping-add-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ShippingAddRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ShippingAddComponent]
})
export class ShippingAddModule { }
