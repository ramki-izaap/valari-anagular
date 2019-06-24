import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseViewComponent } from '../view/purchaseorder-view.component';
const routes: Routes = [
  {
    path: ':id',
    component: PurchaseViewComponent,
    data: {
      title: 'Purchase Orders',
      icon: 'icon-user',
      caption: 'Order View',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseViewRoutingModule { }
