import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
{ path: '',
  data: {
  title: 'Refunds',
  status: false
},
children: [
  {
    path: '',
    loadChildren: './refunds-list/refunds-list.module#RefundsListModule'
  },
  {
    path: 'list',
    loadChildren: './refunds-list/refunds-list.module#RefundsListModule'
  }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundsRoutingModule { }
