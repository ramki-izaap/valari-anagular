import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsListComponent } from '../vendors-list/vendors-list.component';
const routes: Routes = [
  {
    path: '',
    component: VendorsListComponent,
    data: {
      title: 'List',
      icon: 'icon-user',
      caption: 'Vendors List.',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsListRoutingModule { }
