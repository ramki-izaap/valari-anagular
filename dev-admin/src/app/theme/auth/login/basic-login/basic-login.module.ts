import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicLoginComponent } from './basic-login.component';
import {BasicLoginRoutingModule} from './basic-login-routing.module';
import {SharedModule} from '../../../../shared/shared.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    BasicLoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  // providers: [FormBuilder],
  declarations: [BasicLoginComponent]
})
export class BasicLoginModule { }
