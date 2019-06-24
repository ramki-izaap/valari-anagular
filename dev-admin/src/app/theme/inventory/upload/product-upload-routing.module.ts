import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductUploadComponent } from './product-upload.component';

const routes: Routes = [
  {
    path: '',
    component: ProductUploadComponent,
    data: {
      title: 'Upload CSV',
      icon: 'icon-user',
      caption: 'Product Upload.',
      status: true
    }
  },
  {
    path: ':id',
    component: ProductUploadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductUploadRoutingModule { }
