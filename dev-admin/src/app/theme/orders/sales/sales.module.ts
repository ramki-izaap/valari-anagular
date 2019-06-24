import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SalesComponent } from './sales.component';
import { SalesRoutingModule } from './sales-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SalesRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [SalesComponent]
})
export class SalesModule { }
