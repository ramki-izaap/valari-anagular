import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseListComponent } from '../list/purchaseorder-list.component';
const routes: Routes = [
  {
    path: '',
    component: PurchaseListComponent,
    data: {
      title: 'List',
      icon: 'icon-user',
      caption: 'Purchase Orders List.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseListRoutingModule { }
