import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../../shared/shared.module';
import { UserAddComponent } from './user-add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserAddRoutingModule } from './user-add-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserAddRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [UserAddComponent]
})
export class UserAddModule { }
