import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './list/users-list.module#UsersListModule'
      },
      {
        path: 'profile',
        loadChildren: './user-profile/user-profile.module#UserProfileModule'
      },
      {
        path: 'list',
        loadChildren: './list/users-list.module#UsersListModule'
      },
      {
        path: 'add',
        loadChildren: './user-add/user-add.module#UserAddModule'
      },
      {
        path: 'edit',
        loadChildren: './user-add/user-add.module#UserAddModule'
      },
      {
        path: 'view',
        loadChildren: './user-view/user-view.module#UserViewModule'
      }
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
