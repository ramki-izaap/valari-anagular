import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseCreateComponent } from '../create/purchaseorder-create.component';
const routes: Routes = [
  {
    path: '',
    component: PurchaseCreateComponent,
    data: {
      title: 'Add',
      icon: 'icon-shop',
      caption: 'Create Purchase Orders.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseCreateRoutingModule { }
