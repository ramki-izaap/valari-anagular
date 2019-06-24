import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path:'',
  data:{
    title:'Product',
    status:false
  },
  children:[
    {
     path:'',
     loadChildren: './vendor-products-new-list/vendor-products-new-list.module#VendorProductsNewListModule'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorProductsNewRoutingModule { }
