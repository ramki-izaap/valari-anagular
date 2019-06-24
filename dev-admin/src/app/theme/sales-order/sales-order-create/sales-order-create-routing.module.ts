import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesOrderCreateComponent } from '../sales-order-create/sales-order-create.component';
const routes: Routes = [
  {
    path: '',
    component: SalesOrderCreateComponent,
    data: {
      title: 'Add',
      icon: 'icon-shop',
      caption: 'Create Sales Orders.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderCreateRoutingModule { }
