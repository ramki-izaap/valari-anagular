import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsAddComponent } from './vendors-add.component';

const routes: Routes = [
  {
    path: '',
    component: VendorsAddComponent,
    data: {
      title: 'Add',
      icon: 'icon-user',
      caption: 'Create Vendors.',
      status: true
    }
  },
  {
    path: ':id',
    component: VendorsAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsAddRoutingModule { }
