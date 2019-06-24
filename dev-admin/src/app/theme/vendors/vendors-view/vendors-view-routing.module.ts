import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorsViewComponent } from './vendors-view.component';
const routes: Routes = [
  {
    path: ':id',
    component: VendorsViewComponent,
    data: {
      title: 'Vendors',
      icon: 'icon-user',
      caption: 'Vendors View',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsViewRoutingModule { }
