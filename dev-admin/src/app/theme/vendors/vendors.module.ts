import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { VendorsListComponent } from './vendors-list/vendors-list.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
// import { VendorsViewComponent } from './vendors-view/vendors-view.component';

@NgModule({
  imports: [
    CommonModule,
    VendorsRoutingModule,
    FormsModule,
    SharedModule,
  ],
  declarations: []
})
export class VendorsModule { }
