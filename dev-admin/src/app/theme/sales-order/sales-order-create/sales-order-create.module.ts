import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SelectModule} from 'ng-select';
import { SalesOrderCreateRoutingModule } from './sales-order-create-routing.module';
import { SalesOrderCreateComponent } from './sales-order-create.component';
import {JsonpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SalesOrderCreateRoutingModule,
    SharedModule,
    SelectModule,
    NgxDatatableModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SalesOrderCreateComponent]
})
export class SalesOrderCreateModule { }
