import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductViewComponent } from './product-view.component';

const routes: Routes = [
  {
    path: '',
    component: ProductViewComponent,
    data: {
      title: 'View',
      icon: 'icon-user',
      caption: 'View Product.',
      status: true
    }
  },
  {
    path: ':id',
    component: ProductViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductViewRoutingModule { }
