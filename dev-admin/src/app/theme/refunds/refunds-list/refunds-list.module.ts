import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { RefundsListComponent } from './refunds-list.component';
import { RefundsListRoutingModule } from './refunds-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RefundsListRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [RefundsListComponent]
})
export class RefundsListModule { }
