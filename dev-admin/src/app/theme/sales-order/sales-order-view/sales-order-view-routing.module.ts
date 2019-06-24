import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesOrderViewComponent } from './sales-order-view.component';

const routes: Routes = [
  {
    path: '',
    component: SalesOrderViewComponent,
    data: {
      title: 'Sales Order View',
      icon: 'icon-user',
      caption: 'View sales order.',
      status: true
    }
  },
  {
    path: ':id',
    component: SalesOrderViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderViewRoutingModule { }
