import { Component,  OnInit, ViewChild, TemplateRef ,HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {CustomValidators} from 'ng2-validation';
import {IOption} from 'ng-select';
import { IzTableComponent, IzTableInterface } from '../../../../shared/iz-table/iz-table.component';
import { ProductViewComponent } from '../../../../shared/product-view/product-view.component';

// SERVICES
import { PurchaseOrderService, CategoryInterface, ProductInterface } from '../../../../services/purchase-order/purchase-order.service';
import { ProductSearch } from './vendor-product-new-list.interface'
import { AuthService } from '../../../../services/auth/auth.service';
import { CartService, CartSourceInterface} from '../../../../services/cart/cart.service';
import { AppSettingsService, CommonModalInterface, } from './../../../../services/app-settings.service';
import { InventoryService } from '../../../../services/inventory/inventory.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-vendor-products-new-list',
  templateUrl: './vendor-products-new-list.component.html',
  styleUrls: ['./../../../../../assets/icon/icofont/css/icofont.scss']
})
export class VendorProductsNewListComponent implements OnInit {
        
      private categories: Array<CategoryInterface> = [];
      public mappedProductsById: {[key: string]: ProductInterface};
      public mappedProductIds: Array<string> = [];
      public isProductSelectionView = true;
      private vendors = [];
      public vendor_id = '';
      public userRole = 'A';
      allcategories: any;
      filter_category:any;
      //allProducts:string = '0';
      catAndSku:boolean = true;
      cat:boolean=false;
      categoryerror:boolean = false;
      productID: 0;
      myForm : FormGroup;
      search_key: any;
      private searchForm :  ProductSearch ={  category_id: 0,
        search_key: ''
        };
      private cartData: CartSourceInterface;

      public errorMessage: string;
      private _success = new Subject<string>();
      public mappedPoItems: {[key: string]: any};
      public showloader: boolean = false;
      public isNoProductFound: boolean = false;      
      private subscription: Subscription;
      private timer: Observable<any>;
      constructor(private purchaseOrderService: PurchaseOrderService,
                  private authService: AuthService,
                  public inventory: InventoryService,
                  private cartService: CartService,
                  private modalService: NgbModal,
                  private appSettingsService: AppSettingsService,
                  private router: Router) {
                    this.getCategories(this.productID);

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

        const category_id          = new FormControl(this.searchForm.category_id,[Validators.required]);
        const search_key          = new FormControl(this.searchForm.search_key);

        this.myForm = new FormGroup({category_id: category_id,search_key:search_key});

        this.myForm
                      .get('search_key')
                      .valueChanges
                      .pipe(
                        debounceTime(500)
                      )
                      .map((value) => {
                        if (typeof value === 'string') {
                          value = value.trim();
                          this.myForm.get('search_key').setValue(value);
                        }                        
                        return value;
                      })
                      .subscribe((val) => {
                        this.SearchProduct();
                      });
                      
        // Fetch all category products
        this.displayProducts([]);
      }

      displayProducts(categories: Array<CategoryInterface>) {
       
        this.showloader   = true;
        this.isNoProductFound = false;

        this.categories = categories;
        let productIds = [];
        
        if (!this.vendor_id || this.vendor_id === '') {
          this.errorMessage = 'Please select vendor.';
          return;
        }

      
        const poItemsData = {};
        this.purchaseOrderService.getVendorProductItems(this.vendor_id).subscribe((resp: any)  => {
          for (const product of resp.data) {
            poItemsData[product.product_variant_sku] = product;
          }
          this.mappedPoItems = poItemsData;
          console.log('poItemsData', poItemsData, this.cartService.contents());
          this.purchaseOrderService
            .getProductDetails(productIds)
            .subscribe((mappedProductsById => {
              // console.log('showloader',this.showloader, this.isNoProductFound);              
              this.mappedProductsById = mappedProductsById;
              this.mappedProductIds = Object.keys(mappedProductsById);
              this.isProductSelectionView = false;
              this.showloader   = false;
              if (!this.mappedProductIds.length) {
                this.isNoProductFound = true;
              }
              console.log('mappedProductIds',this.mappedProductsById);
              console.log('mappedPoItems',this.mappedPoItems);
              
              
            }));
        });  
          
      }

      // back() {
      //   this.isProductSelectionView = true;
      // }
      createVendorProducts() {
        // alert(this.vendor_id);
        const params = { vendorID: this.vendor_id, cart: this.cartService.contents()};
        console.log(params);
        this.purchaseOrderService.createvendorProducts(params)
      .subscribe( (httpResponse: any) => {

        let modalData: CommonModalInterface = null;
        if (httpResponse && httpResponse.status === 'success') {
         console.log('poItemsData', 'Record updated successfully');
         
          modalData = {
            title: 'Success',
            content: 'Record updated successfully',
            beforeDismiss: () => {
              this.myForm.reset({category_id:0});
              this.mappedProductIds = [];
              this.mappedProductsById = {};
              this.mappedPoItems = [];
              this.cartService.resetCartData();
              this.displayProducts([]);
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

      getCategories(productID) {

        this.inventory.getCategoriesNew(productID).subscribe( resp => {
          this.allcategories = resp;
          console.log(this.allcategories);
        });
      }

      // isSearchable(productId) {
        
      //   let product: ProductInterface = this.mappedProductsById[productId];
        
      //   if (product.sku === 'TU85P1') {
      //     console.log('productId', productId, this.mappedProductsById[productId]);
      //     return true;
      //   }

      //   return false;
      // }

      SearchProduct()
      {
          console.log(this.myForm.value, this.cartData.cartItems);
          
          this.showloader   = true;
          this.isNoProductFound = false;

          this.myForm.value.search_key = typeof this.myForm.value.search_key == 'string' ? this.myForm.value.search_key.trim(): '';

          if (this.myForm.value.search_key === '' && this.myForm.value.category_id=="0") {
            setTimeout(() => {
              this.mappedProductIds = Object.keys(this.mappedProductsById);
              this.hideLoader();
            }, 500);
             return;
          }else if(this.myForm.value.search_key === null && this.myForm.value.category_id=="0"){
            setTimeout(() => {
              this.mappedProductIds = Object.keys(this.mappedProductsById);
              this.hideLoader();
            }, 500);
             return;
          }
          
          this.mappedProductIds = [];
          
          for (const productId in this.mappedProductsById) {
            if (this.mappedProductsById.hasOwnProperty(productId)) {
              const product = this.mappedProductsById[productId];
              let sku = product.sku.toLowerCase();

              if(this.myForm.value.search_key && this.myForm.value.search_key.length){
                this.search_key = this.myForm.value.search_key.toLowerCase().trim();
              }
              
              let flag = false;

              let cat_ids: Array<any> = this.getUniqCategoryIds(product.categoryIds);

              if (this.myForm.value.category_id != "0" && this.myForm.value.category_id  && this.myForm.value.search_key && this.myForm.value.search_key.length) {
                if (cat_ids.indexOf(this.myForm.value.category_id) !== -1 && sku.indexOf(this.search_key) !== -1) {
                  flag = true;
                }
               // console.log('catandsearchkey',this.myForm.value.category_id);
              } else if(this.myForm.value.category_id != "0" && this.myForm.value.category_id) {
                if(cat_ids.indexOf(this.myForm.value.category_id) !== -1) {
                  flag = true;
               // this.setTimer(2000);

                }      
               // console.log('cat');     
              } else if(this.search_key) {
                if(sku.indexOf(this.search_key) !== -1) {
                  flag = true;
                  
                }        
               console.log('searchkey');       
              }
              
              if (flag) {
                this.mappedProductIds.push(''+product.id);
              }
            }
            
          }
         
          if (!this.mappedProductIds.length) {
            this.isNoProductFound = true;
          }
          this.hideLoader();
          console.log('this.mappedProductIds', this.mappedProductIds);    
      }

      /**
       * hideLoader
       */
      public hideLoader() {
        setTimeout(() => {
          this.showloader   = false;
        }, 1000);
      }


      /**
       * getUniqCategoryIds
       */
      public getUniqCategoryIds(str = '') {
        let arr = str.split(',');
        return arr;
      }
      

}
