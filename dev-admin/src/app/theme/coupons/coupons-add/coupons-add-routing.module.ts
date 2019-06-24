import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponsAddComponent } from './coupons-add.component';
const routes: Routes = [{
    path: '',
    component: CouponsAddComponent,
    data: {
      title: 'Add',
      icon: 'icon-user',
      caption: 'Create Coupons.',
      status: true
    }
  },
  {
    path: ':id',
    component: CouponsAddComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsAddRoutingModule { }
