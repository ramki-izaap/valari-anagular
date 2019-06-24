import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorProductsRoutingModule } from './vendor-products-routing.module';

import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VendorProductsRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: []
})
export class VendorProductsModule { }
