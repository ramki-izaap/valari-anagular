import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryAddComponent } from './category-add.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryAddComponent,
    data: {
      title: 'Add',
      icon: 'icon-user',
      caption: 'Create Category.',
      status: true
    }
  },
  {
    path: ':id',
    component: CategoryAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryAddRoutingModule { }
