import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefundsListComponent } from '../refunds-list/refunds-list.component';
const routes: Routes = [{
  path: '',
  component: RefundsListComponent,
  data: {
    title: 'List',
    icon: 'icon-user',
    caption: 'Refunds list.',
    status: true
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundsListRoutingModule { }
