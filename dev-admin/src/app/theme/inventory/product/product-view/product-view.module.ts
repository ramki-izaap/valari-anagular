import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { ProductViewRoutingModule } from './product-view-routing.module';
import { ProductViewComponent } from './product-view.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { NgxEditorModule } from 'ngx-editor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    CommonModule,
    ProductViewRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    NguiAutoCompleteModule,
    NgxDatatableModule,
    NgxEditorModule,
    TooltipModule.forRoot()
  ],
  declarations: [ProductViewComponent]
})
export class ProductViewModule { }
