import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { SalesOrderViewRoutingModule } from './sales-order-view-routing.module';
import { SalesOrderViewComponent } from './sales-order-view.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SalesOrderViewRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SalesOrderViewComponent]
})
export class SalesOrderViewModule { }
