import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { UsersListRoutingModule } from './users-list-routing.module';
import { UsersListComponent } from './users-list.component';
@NgModule({
  imports: [
    CommonModule,
    UsersListRoutingModule,
    SharedModule,
    NgxDatatableModule
  ],
  declarations: [UsersListComponent]
})
export class UsersListModule { }
