import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './banner.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BannerRoutingModule
  ],
  declarations: [BannerComponent]
})
export class BannerModule { }
