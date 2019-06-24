import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import { VendorProductsListRoutingModule } from './vendor-products-list-routing.module';
import { VendorProductsListComponent } from './vendor-products-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    VendorProductsListRoutingModule
  ],
  declarations: [VendorProductsListComponent]
})
export class VendorProductsListModule { }
