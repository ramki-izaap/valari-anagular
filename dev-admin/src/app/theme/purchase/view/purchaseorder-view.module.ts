import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PurchaseViewRoutingModule } from './purchaseorder-view-routing.module';
import { VariantListComponent } from '../variant-list/variantlist.component';
import { PurchaseViewComponent } from './purchaseorder-view.component';
@NgModule({
  imports: [
    CommonModule,
    PurchaseViewRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PurchaseViewComponent, VariantListComponent]
})
export class PurchaseViewModule { }
