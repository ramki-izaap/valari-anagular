import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefundsRoutingModule } from './refunds-routing.module';
import { RefundsListComponent } from './refunds-list/refunds-list.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RefundsRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: []
})
export class RefundsModule { }
