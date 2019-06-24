import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import { CategoryAddRoutingModule } from './category-add-routing.module';
import { CategoryAddComponent } from './category-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CategoryAddRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  declarations: [CategoryAddComponent]
})
export class CategoryAddModule { }
