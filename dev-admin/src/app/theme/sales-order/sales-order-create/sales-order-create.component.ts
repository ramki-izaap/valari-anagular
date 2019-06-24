import { Component, OnInit, ViewChild, TemplateRef, group } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {IOption} from 'ng-select';
import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { ProductViewComponent } from '../../../shared/product-view/product-view.component';

// SERVICES
import { SalesOrderService, CategoryInterface, ProductInterface } from '../../../services/sales-order/sales-order.service';
import { PurchaseOrderService } from '../../../services/purchase-order/purchase-order.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CartService, CartSourceInterface} from '../../../services/cart/cart.service';
import { AppSettingsService, CommonModalInterface } from './../../../services/app-settings.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ShippingCreation, CustomerCreation } from './sales-order-add.interface';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-sales-order-create',
  templateUrl: './sales-order-create.html',
  styleUrls: ['./../../../../assets/icon/icofont/css/icofont.scss']
})
export class SalesOrderCreateComponent implements OnInit {
  
  private categories: Array<CategoryInterface> = [];
  public mappedProductsById: {[key: string]: ProductInterface};
  public mappedProductIds: Array<string> = [];
  public isProductSelectionView = true;
  private vendors = [];
  public vendor_id = '';
  public user_id = '';
  private cartData: CartSourceInterface;
  public shippingVariable: ShippingCreation = {
                                                firstName: '',
                                                lastName: '',
                                                address1: '',
                                                address2: '',
                                                city: '',
                                                state: '',
                                                country: '',
                                                zipcode : null
                                              };
  public customerVariable: CustomerCreation = {firstName: '', lastName: '', email: '', password: '', userID: ''};
  public shippingForm:  FormGroup;
  public shippingFormSubmitted:boolean = false;
  public customerForm:  FormGroup;
  public showShippingForm = false;
  public showCustomerLabel = false;
  public showProductForm = false;
  public shippingAddressId: number = null;
  public showSelectShipping = false;
  public errorMessage: string;
  public successMessage: string;
  public showBackHomeButton = false;
  public showCreateCustomerButton = true;
  public customerLabel = '';
  public customerAddress = [];
  public customerFormSubmitted = false;
  private _success = new Subject<string>();
  constructor(private salesOrderService: SalesOrderService,
              private authService: AuthService,
              private cartService: CartService,
              private modalService: NgbModal,
              private appSettingsService: AppSettingsService,
              private purchaseOrderService: PurchaseOrderService,
              private router: Router) {

  }

  ngOnInit() {

    this.shippingForm = new FormGroup({
      firstName: new FormControl(this.shippingVariable.firstName, [Validators.required]),
      lastName: new FormControl(this.shippingVariable.lastName, [Validators.required]),
      address1: new FormControl(this.shippingVariable.address1, [Validators.required]),
      address2: new FormControl(this.shippingVariable.address2, []),
      city: new FormControl(this.shippingVariable.city, [Validators.required]),
      state: new FormControl(this.shippingVariable.state, [Validators.required]),
      country: new FormControl(this.shippingVariable.country, [Validators.required]),
      zipcode: new FormControl(this.shippingVariable.zipcode, [Validators.required, CustomValidators.number])
    });

    this.vendor_id = this.authService.getUserId();
    
    this.customerVariable.userID = this.vendor_id;
    this.customerForm = new FormGroup({
      firstName: new FormControl(this.customerVariable.firstName, [Validators.required]),
      lastName: new FormControl(this.customerVariable.lastName, [Validators.required]),
      email: new FormControl(this.customerVariable.email, [Validators.required, Validators.email]),
      password: new FormControl(this.customerVariable.password, [Validators.required]),
      userID: new FormControl(this.customerVariable.userID, []),
    });

    

    this
      .salesOrderService
      .getVariants()
      .subscribe((mappedCategories) => {
        console.log(mappedCategories);
      });

    this.cartService.cart$.subscribe(cartData => {
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

    
    this.getUsers();
    

      // Error message displayer
    this._success.subscribe((message) => this.errorMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = null);

    
  }

  getUsers() {
    this
      .salesOrderService
      .getCustomers(this.vendor_id)
      .subscribe((mappedVendors) => {
        const httpResponse: any = mappedVendors;
        this.vendors = httpResponse.data;
       console.log(this.vendors);
      });
  }

  displayProducts(categories: Array<CategoryInterface>) {
    // console.log(event);
    this.categories = categories;
    const productIds = this.getSelectedProductIds();
    console.log(productIds);
    if (!this.user_id || this.user_id === '') {
      this.errorMessage = 'Please select customer.';
      return;
    }

    if (!productIds.length) {
      alert('Please select atleast one product.');
      return;
    }

    this.salesOrderService
      .getProductDetails(productIds, 'SO',this.vendor_id)
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

  createSO() {
    // alert(this.vendor_id);
    
    let filteredCartContent = [];
    for (const item of this.cartService.contents()) {
      if (item.orderedQuantity) {
        filteredCartContent.push(item);
      }      
    }

    const params = { shippingId: this.shippingAddressId, userID: this.user_id, vendorID: this.vendor_id, cart: filteredCartContent};
    console.log(params.cart);
    this.salesOrderService.createSO(params)
   .subscribe( (httpResponse: any) => {

    let modalData: CommonModalInterface = null;
     if (httpResponse && httpResponse.status === 'success') {
      
      this.cartService.resetCartData();

      modalData = {
        title: 'Success',
        content: 'Sales order created successfully',
        beforeDismiss: () => {
          this.router.navigate(['/sales-order/list']);
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


  createShippingAddress() {
    console.log('Shipping Form', this.shippingForm);
    this.shippingFormSubmitted = true;

    if(this.shippingForm.invalid){
      return;
    }

    if (this.shippingForm.valid) {
      this.salesOrderService.createShipping(this.shippingForm.value).subscribe((res) => {
        if (res.status === 'success') {
          this.showProductForm = true;
          this.showShippingForm = false;
          this.successMessage = res.msg;
          this.shippingAddressId = res.shipping_id;
        }
        console.log(res);
      });
    }
  }

  addCustomer() {
    console.log('Customer Form', this.customerForm);
    this.customerFormSubmitted = true;
    if (this.customerForm.valid) {
      this.salesOrderService.createCustomer(this.customerForm.value).subscribe((res) => {
        if (res.status === 'success') {
          // this.vendors = res.data;
          this.getUsers();
          this.successMessage = res.msg;
          this.close();
        }
        console.log(res);
      });
    }
  }

  onCustomerChange(event) {
    this.shippingAddressId = null;
    this.showShippingForm = false;
    this.customerLabel =  event.target.options[event.target.selectedIndex].text;
    this.salesOrderService.getCustomerAddress({user_id: this.user_id}).subscribe((res) => {
      console.log(res);
      if (res.status === 'success') {
        this.showSelectShipping = true;
        this.customerAddress = res.data;
      }
    });
  }
  showModal() {
    document.querySelector('#effect-1').classList.add('md-show');
    console.log('Customer Form', this.customerForm);
  }
  close() {
    document.querySelector('#effect-1').classList.remove('md-show');
  }

  saveShipping() {

    if(this.shippingAddressId == null){
      alert('Please select shipping address');
      this.showProductForm = false;
      this.showBackHomeButton = false;
      this.showSelectShipping = true;
      return; 
    }
    
    this.showCustomerLabel = true;
    this.showBackHomeButton = true;
    this.showCreateCustomerButton = false;
    this.showSelectShipping = false;
    this.showProductForm = true;
    console.log(this.shippingAddressId);
  }
  setShipping() {
    this.showSelectShipping = false;
    this.showShippingForm = true;
  }
  backShipping() {
    this.showShippingForm = false;
    this.showSelectShipping = true;
  }
  backToHome() {
    this.showCustomerLabel = false;
    this.showCreateCustomerButton = true;
    this.showBackHomeButton = false;
    this.showSelectShipping = true;
    this.showProductForm = false;
  }
}
