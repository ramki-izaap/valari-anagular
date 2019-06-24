import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { VendorsAddRoutingModule } from './vendors-add-routing.module';
import { VendorsAddComponent } from './vendors-add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    VendorsAddRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [VendorsAddComponent]
})
export class VendorsAddModule { }
