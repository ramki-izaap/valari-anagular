import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { VendorsViewRoutingModule } from './vendors-view-routing.module';
import { VendorsViewComponent } from './vendors-view.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    VendorsViewRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [VendorsViewComponent]
})
export class VendorsViewModule { }
