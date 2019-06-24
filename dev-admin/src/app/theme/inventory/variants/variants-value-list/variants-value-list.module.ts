import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import { VariantsValueListRoutingModule } from './variants-value-list-routing.module';
import { VariantsValueListComponent } from './variants-value-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    VariantsValueListRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [VariantsValueListComponent]
})
export class VariantsValueListModule { }
