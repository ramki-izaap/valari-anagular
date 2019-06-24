import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentInfoComponent } from './payment-info.component';
const routes: Routes = [
  {
    path: '',
    component: PaymentInfoComponent,
    data: {
      title: 'Payment Information',
      icon: 'icon-user',
      caption: '',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentInfoRoutingModule { }
