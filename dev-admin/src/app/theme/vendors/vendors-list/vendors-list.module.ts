import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { VendorsListRoutingModule } from './vendors-list-routing.module';
import { VendorsListComponent } from './vendors-list.component';
@NgModule({
  imports: [
    CommonModule,
    VendorsListRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [VendorsListComponent]
})
export class VendorsListModule { }
