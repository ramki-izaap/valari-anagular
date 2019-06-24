import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { CouponsListRoutingModule } from './coupons-list-routing.module';
import { CouponsListComponent } from './coupons-list.component';
@NgModule({
  imports: [
    CommonModule,
    CouponsListRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [CouponsListComponent]
})
export class CouponsListModule { }
