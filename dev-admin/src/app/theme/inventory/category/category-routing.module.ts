import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Category',
      status: false
    },
    children: [
      {
        path: '',
        loadChildren: './category-list/category-list.module#CategoryListModule'
      },
      {
        path: 'list',
        loadChildren: './category-list/category-list.module#CategoryListModule'
      },
      {
        path: 'add',
        loadChildren: './category-add/category-add.module#CategoryAddModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
