import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsAddComponent } from './coupons-add/coupons-add.component';
import { CouponsListComponent } from './coupons-list/coupons-list.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CouponsRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: []
})
export class CouponsModule { }
