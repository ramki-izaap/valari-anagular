import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { SalesOrderListComponent } from './sales-order-list.component';
import { SalesOrderListRoutingModule } from './sales-order-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SalesOrderListRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [SalesOrderListComponent]
})
export class SalesOrderListModule { }
