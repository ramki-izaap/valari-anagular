import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SelectModule} from 'ng-select';
import { PurchaseCreateRoutingModule } from './purchaseorder-create-routing.module';
import { PurchaseCreateComponent } from './purchaseorder-create.component';
import {JsonpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PurchaseCreateRoutingModule,
    SharedModule,
    SelectModule,
    NgxDatatableModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PurchaseCreateComponent]
})
export class PurchaseCreateModule { }
