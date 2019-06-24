import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import {SharedModule} from '../../../../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ProductAddRoutingModule } from './product-add-routing.module';
import { ProductAddComponent } from './product-add.component';

@NgModule({
  imports: [
    CommonModule,
    ProductAddRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    NguiAutoCompleteModule,
    NgxEditorModule,
    TooltipModule.forRoot() 
  ],
  declarations: [ProductAddComponent]
})
export class ProductAddModule { }
