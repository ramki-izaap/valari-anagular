import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangepasswordComponent } from './changepassword.component';

const routes: Routes = [
    {
      path:'',
      component: ChangepasswordComponent,
      data: {
        title: 'Change Password'
      //  icon: 'icon-user'
      }
    },
    {
      path:':id',
      component: ChangepasswordComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangepasswordRoutingModule { }
