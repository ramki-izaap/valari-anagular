import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import {SharedModule} from '../../../shared/shared.module';

import { ProductUploadRoutingModule } from './product-upload-routing.module';
import { ProductUploadComponent } from './product-upload.component';

@NgModule({
  imports: [
    CommonModule,
    ProductUploadRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    NguiAutoCompleteModule
  ],
  declarations: [ProductUploadComponent]
})
export class ProductUploadModule { }
