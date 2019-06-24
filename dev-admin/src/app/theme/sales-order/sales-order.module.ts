import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { SalesOrderViewComponent } from './sales-order-view/sales-order-view.component';
import { AddressComponent } from '../../shared/address/address.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SalesOrderRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: []
})
export class SalesOrderModule { }
