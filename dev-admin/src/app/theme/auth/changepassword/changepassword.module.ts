import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangepasswordRoutingModule } from './changepassword-routing.module';
import { ChangepasswordComponent } from './changepassword.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ChangepasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ChangepasswordComponent]
})

export class ChangepasswordModule { }