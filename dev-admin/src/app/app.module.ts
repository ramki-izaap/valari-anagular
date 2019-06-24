import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy ,PathLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {MenuItems} from './shared/menu-items/menu-items';
import {BreadcrumbsComponent} from './layout/admin/breadcrumbs/breadcrumbs.component';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

// PROVIDERS
import { HttpInterceptorService } from '../app/services/http-interceptor/http-interceptor.service';
import { AppSettingsService } from '../app/services/app-settings.service';
import { AuthService } from '../app/services/auth/auth.service';
import { UsersService } from '../app/services/users/users.service';
import { InventoryService } from '../app/services/inventory/inventory.service';
import { LoggedInUsersGuardService } from '../app/services/guards/logged-in-users-guard.service';
import { PurchaseService } from '../app/services/purchase.service';
import { CouponsService } from '../app/services/coupons/coupons.service';
import { SalesOrderService } from '../app/services/sales-order/sales-order.service';
import { PurchaseOrderService } from '../app/services/purchase-order/purchase-order.service';
import { CartService } from '../app/services/cart/cart.service';
import { DashboardService } from '../app/services/dashboard/dashboard.service';
import { ShippingChargeService } from '../app/services/shipping-charge/shipping-charge.service';


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    BreadcrumbsComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NguiAutoCompleteModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    MenuItems,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: 'LOCALSTORAGE',
      useFactory: getLocalStorage
    },
    AppSettingsService,
    AuthService,
    CartService,
    LoggedInUsersGuardService,
    UsersService,
    InventoryService,
    PurchaseOrderService,
    PurchaseService,
    CouponsService,
    SalesOrderService,
    DashboardService,
    ShippingChargeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getLocalStorage() {
  return (typeof window !== 'undefined') ? window.localStorage : null;
}
