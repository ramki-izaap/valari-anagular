import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { CouponsAddRoutingModule } from './coupons-add-routing.module';
import { CouponsAddComponent } from './coupons-add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
@NgModule({
  imports: [
    CommonModule,
    CouponsAddRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule
  ],
  declarations: [CouponsAddComponent]
})
export class CouponsAddModule { }
