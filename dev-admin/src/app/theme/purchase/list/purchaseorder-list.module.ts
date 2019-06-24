import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { PurchaseListRoutingModule } from './purchaseorder-list-routing.module';
import { PurchaseListComponent } from './purchaseorder-list.component';
@NgModule({
  imports: [
    CommonModule,
    PurchaseListRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [PurchaseListComponent]
})
export class PurchaseListModule { }
