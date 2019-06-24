import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {IOption} from 'ng-select';
import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { ProductViewComponent } from '../../../shared/product-view/product-view.component';

// SERVICES
import { PurchaseOrderService, CategoryInterface, ProductInterface } from '../../../services/purchase-order/purchase-order.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CartService, CartSourceInterface} from '../../../services/cart/cart.service';
import { AppSettingsService, CommonModalInterface } from './../../../services/app-settings.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
@Component({
  selector: 'app-purchase-create',
  templateUrl: './purchaseorder-create.html',
  styleUrls: ['./../../../../assets/icon/icofont/css/icofont.scss']
})
export class PurchaseCreateComponent implements OnInit {
  private categories: Array<CategoryInterface> = [];
  public mappedProductsById: {[key: string]: ProductInterface};
  public mappedProductIds: Array<string> = [];
  public isProductSelectionView = true;
  private vendors = [];
  public vendor_id = '';
  public userRole = 'A';
  private cartData: CartSourceInterface;

  public errorMessage: string;
  private _success = new Subject<string>();
  constructor(private purchaseOrderService: PurchaseOrderService,
              private authService: AuthService,
              private cartService: CartService,
              private modalService: NgbModal,
              private appSettingsService: AppSettingsService,
              private router: Router) {

  }

  ngOnInit() {

    this
      .purchaseOrderService
      .getVariants()
      .subscribe((mappedCategories) => {
        console.log(mappedCategories);
      });

      this.cartService.resetCartData().then((status) => {
        // Update cart Info
        this.cartService.cart$.subscribe(cartData => {
          console.log('Reset Info', cartData);
          if (cartData) {
            this.cartData = cartData;
          } else {
            this.cartData = {
              cart: null,
              cartTotal: 0,
              totalItems: 0,
              cartItems: []
            };
          }
        });
      });
      this
      .purchaseOrderService
      .getVendors()
      .subscribe((mappedVendors) => {
        this.vendors = mappedVendors.data;
        console.log(this.vendors);
      });

    console.log(this.authService.getUserRole(), this.authService.getUserId());
    if (this.authService.getUserRole() === 'V') {
      this.vendor_id = this.authService.getUserId();
      this.userRole = 'V';
    }
      // Error message displayer
    this._success.subscribe((message) => this.errorMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = null);
  }

  displayProducts(categories: Array<CategoryInterface>) {
    // console.log(event);
    this.categories = categories;
    const productIds = this.getSelectedProductIds();
    console.log(productIds);
    if (!this.vendor_id || this.vendor_id === '') {
      this.errorMessage = 'Please select vendor.';
      return;
    }

    if (!productIds.length) {
      this.errorMessage = 'Please select atleast one product.';
      return;
    }

    this.purchaseOrderService
      .getProductDetails(productIds)
      .subscribe((mappedProductsById => {
        console.log('mappedProductsById', mappedProductsById);
        this.mappedProductsById = mappedProductsById;
        this.mappedProductIds = Object.keys(mappedProductsById);
        console.log('mappedProductIds', this.mappedProductIds);
        this.isProductSelectionView = false;
      }));
  }

  getSelectedProductIds(): Array<string> {
    const productIds = [];
    for (const category of this.categories) {
      for (const product of category.products) {
        if (product.selected) {
          productIds.push(product.id);
        }
      }
    }
    return productIds;
  }

  back() {
    this.isProductSelectionView = true;
  }
  createPO() {
    // alert(this.vendor_id);
    const params = { vendorID: this.vendor_id, cart: this.cartService.contents()};
    console.log(params);
    this.purchaseOrderService.createPO(params)
   .subscribe( (httpResponse: any) => {

    let modalData: CommonModalInterface = null;
     if (httpResponse && httpResponse.status === 'success') {

      modalData = {
        title: 'Success',
        content: 'Purchase order created successfully',
        beforeDismiss: () => {
          this.router.navigate(['/purchase/list']);
        }
      };
     } else {
      modalData = {
        title: 'Error',
        content: httpResponse.message,
        beforeDismiss: () => {}
      };
      // this.errorMessage = httpResponse.message;
     }
    this.appSettingsService.setCommonModalData(modalData);
   });
  }

}
