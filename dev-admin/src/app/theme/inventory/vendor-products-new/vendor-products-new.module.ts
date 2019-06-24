import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SelectModule} from 'ng-select';
import { VendorProductsNewRoutingModule } from './vendor-products-new-routing.module';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VendorProductsNewRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: []
})
export class VendorProductsNewModule { }
