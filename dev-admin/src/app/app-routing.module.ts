import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthComponent} from './layout/auth/auth.component';
import { LoggedInUsersGuardService } from '../app/services/guards/logged-in-users-guard.service';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: './theme/auth/auth.module#AuthModule'
      },
      {
        path: 'auth',
        loadChildren: './theme/auth/auth.module#AuthModule'
      },
      {
        path: 'maintenance/offline-ui',
        loadChildren: './theme/maintenance/offline-ui/offline-ui.module#OfflineUiModule'
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [LoggedInUsersGuardService],
    children: [
      // {
      //   path: '',
      //   redirectTo: 'dashboard/default',
      //   pathMatch: 'full'
      // },
      {
        path: 'dashboard',
        loadChildren: './theme/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'vendors',
        loadChildren: './theme/vendors/vendors.module#VendorsModule'
      },
      {
        path: 'purchase',
        loadChildren: './theme/purchase/purchase.module#PurchaseModule'
      },
      {
        path: 'coupons',
        loadChildren: './theme/coupons/coupons.module#CouponsModule'
      },
      {
        path: 'sales-order',
        loadChildren: './theme/sales-order/sales-order.module#SalesOrderModule'
      },
      {
        path: 'coupons',
        loadChildren: './theme/coupons/coupons.module#CouponsModule'
      },
      {
        path: 'refunds',
        loadChildren: './theme/refunds/refunds.module#RefundsModule'
      },
      {
        path: 'category',
        loadChildren: './theme/inventory/category/category.module#CategoryModule'
      },
      {
        path: 'upload',
        loadChildren: './theme/inventory/upload/product-upload.module#ProductUploadModule'
      },
      {
        path: 'product',
        loadChildren: './theme/inventory/product/product.module#ProductModule'
      },
      {
        path: 'vendor-products-old',
        loadChildren: './theme/inventory/vendor-products/vendor-products.module#VendorProductsModule'
      },
      {
        path: 'variants',
        loadChildren: './theme/inventory/variants/variants.module#VariantsModule'
      },
      {
        path: 'settings',
        loadChildren: './theme/settings/settings.module#SettingsModule'
      },
      {
        path: 'shipping-charge',
        loadChildren: './theme/shipping-charge/shipping-charge.module#ShippingChargeModule'
      },
      {
        path: 'payment-info',
        loadChildren: './theme/payment-info/payment-info.module#PaymentInfoModule'
      },
      {
        path: 'navigation',
        loadChildren: './theme/navigation/navigation.module#NavigationModule'
      },
      {
        path: 'widget',
        loadChildren: './theme/widget/widget.module#WidgetModule'
      },
      // {
      //   path: 'basic',
      //   loadChildren: './theme/ui-elements/basic/basic.module#BasicModule'
      // },
      // {
      //   path: 'advance',
      //   loadChildren: './theme/ui-elements/advance/advance.module#AdvanceModule'
      // },
      // {
      //   path: 'animations',
      //   loadChildren: './theme/ui-elements/animation/animation.module#AnimationModule'
      // },
      {
        path: 'forms',
        loadChildren: './theme/forms/forms.module#FormsModule'
      },
      {
        path: 'bootstrap-table',
        loadChildren: './theme/table/bootstrap-table/bootstrap-table.module#BootstrapTableModule'
      },
      {
        path: 'data-table',
        loadChildren: './theme/table/data-table/data-table.module#DataTableModule'
      },
      {
        path: 'maintenance/error',
        loadChildren: './theme/maintenance/error/error.module#ErrorModule'
      },
      {
        path: 'maintenance/coming-soon',
        loadChildren: './theme/maintenance/coming-soon/coming-soon.module#ComingSoonModule'
      },
      {
        path: 'user',
        loadChildren: './theme/user/user.module#UserModule'
      },
      {
        path: 'orders',
        loadChildren: './theme/orders/orders.module#OrdersModule'
      },
      {
        path: 'task',
        loadChildren: './theme/task/task.module#TaskModule'
      },
      {
        path: 'invoice',
        loadChildren: './theme/extension/invoice/invoice.module#InvoiceModule'
      },
      {
        path: 'file-upload-ui',
        loadChildren: './theme/extension/file-upload-ui/file-upload-ui.module#FileUploadUiModule'
      },
      {
        path: 'charts',
        loadChildren: './theme/chart/chart.module#ChartModule'
      },
      {
        path: 'map',
        loadChildren: './theme/map/map.module#MapModule'
      },
      {
        path: 'simple-page',
        loadChildren: './theme/simple-page/simple-page.module#SimplePageModule'
      },
      {
        path: 'banner',
        loadChildren: './theme/banner/banner.module#BannerModule'
      },
      {
        path: 'vendor-products',
        loadChildren: './theme/inventory/vendor-products-new/vendor-products-new.module#VendorProductsNewModule'
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
