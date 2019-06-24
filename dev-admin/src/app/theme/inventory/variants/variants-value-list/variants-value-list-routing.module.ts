import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VariantsValueListComponent } from './variants-value-list.component';

const routes: Routes = [{
  path: '',
  component: VariantsValueListComponent,
  data: {
    title: 'list',
    icon: 'icon-user',
    caption: 'Variants Value Lists.',
    status: true
  }
},
{
  path: ':id',
  component: VariantsValueListComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariantsValueListRoutingModule { }
