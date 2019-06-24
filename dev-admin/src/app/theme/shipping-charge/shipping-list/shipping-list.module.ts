import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { ShippingListComponent } from '../shipping-list/shipping-list.component';
import { ShippingListRoutingModule } from './shipping-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ShippingListRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [ShippingListComponent]
})
export class ShippingListModule { }
