import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import { VariantsAddRoutingModule } from './variants-add-routing.module';
import { VariantsAddComponent } from './variants-add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    VariantsAddRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [VariantsAddComponent]
})
export class VariantsAddModule { }
