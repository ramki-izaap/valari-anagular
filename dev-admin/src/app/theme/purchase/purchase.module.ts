import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PurchaseListComponent } from './list/purchaseorder-list.component';
import { PurchaseCreateComponent } from './create/purchaseorder-create.component';
@NgModule({
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class PurchaseModule { }
