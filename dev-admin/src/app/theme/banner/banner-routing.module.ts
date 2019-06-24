import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BannerComponent } from './banner.component';
const routes: Routes = [
  {
    path:'',
    component:BannerComponent,
    data: {
      title: 'Banner',
      icon: 'icon-blackboard',
      caption: 'Add Banner / Logo',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerRoutingModule { }
