import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesOrderListComponent } from '../sales-order-list/sales-order-list.component';
const routes: Routes = [
  {
    path: '',
    component: SalesOrderListComponent,
    data: {
      title: 'List',
      icon: 'icon-user',
      caption: 'Sales order List.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderListRoutingModule { }
