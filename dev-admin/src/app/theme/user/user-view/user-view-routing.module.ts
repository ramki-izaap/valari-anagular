import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserViewComponent } from './user-view.component';
const routes: Routes = [
  {
    path: ':id',
    component: UserViewComponent,
    data: {
      title: 'user',
      icon: 'icon-user',
      caption: 'user View',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserViewRoutingModule { }
