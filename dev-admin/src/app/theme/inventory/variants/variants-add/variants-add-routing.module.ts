import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VariantsAddComponent } from './variants-add.component';
const routes: Routes = [
  {
  path: '',
  component: VariantsAddComponent,
  data: {
    title: 'Add',
    icon: 'icon-user',
    caption: 'Create Variants.',
    status: true
  }
},
{
  path: ':id',
  component: VariantsAddComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariantsAddRoutingModule { }
