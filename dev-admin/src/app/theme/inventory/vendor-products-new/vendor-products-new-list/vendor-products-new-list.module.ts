import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SelectModule} from 'ng-select';
import { VendorProductsNewListComponent } from './vendor-products-new-list.component';
import { VendorProductsNewListRoutingModule } from './vendor-products-new-list-routing.module';
import {JsonpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    VendorProductsNewListRoutingModule,
    SelectModule,
    NgxDatatableModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [VendorProductsNewListComponent]
})
export class VendorProductsNewListModule { }
