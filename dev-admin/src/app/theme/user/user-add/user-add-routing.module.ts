import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAddComponent } from './user-add.component';

const routes: Routes = [
  {
    path: '',
    component: UserAddComponent,
    data: {
      title: 'Add',
      icon: 'icon-user',
      caption: 'Create/Update user.',
      status: true
    }
  },
  {
    path: ':id',
    component: UserAddComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserAddRoutingModule { }
