import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VariantsListComponent } from './variants-list.component';
const routes: Routes = [{
  path: '',
  component: VariantsListComponent,
  data: {
    title: 'List',
    icon: 'icon-user',
    caption: 'Variants List.',
    status: true
  }
},
{
  path: ':id',
  component: VariantsListComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariantsListRoutingModule { }
