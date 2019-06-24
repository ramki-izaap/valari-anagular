import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
{
  path: '',
  data: {
    title: 'Variants',
    status: false
  },
  children: [
    {
      path: 'add',
      loadChildren: './variants-add/variants-add.module#VariantsAddModule'
    },
    {
      path: '',
      loadChildren: './variants-list/variants-list.module#VariantsListModule'
    },
    {
      path: 'list',
      loadChildren: './variants-list/variants-list.module#VariantsListModule'
    },
    {
      path: 'variants-value-list',
      loadChildren: './variants-value-list/variants-value-list.module#VariantsValueListModule'
    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariantsRoutingModule { }
