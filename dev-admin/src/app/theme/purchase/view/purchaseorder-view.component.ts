import { Component, OnInit, ViewChild, Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VariantListComponent, VariantInterface } from '../variant-list/variantlist.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PurchaseService } from '../../../services/purchase.service';
import { PurchaseOrderService, CategoryInterface, ProductInterface } from '../../../services/purchase-order/purchase-order.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CartService, CartSourceInterface} from '../../../services/cart/cart.service';

// SERVICE
import { AppSettingsService, CommonModalInterface } from './../../../services/app-settings.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchaseorder-view.html',
  styleUrls: ['./../../../../assets/icon/icofont/css/icofont.scss']
})
export class PurchaseViewComponent implements OnInit {
  private purchaseOrderId: string;
  private puchaseId: string;
  public poData: any;
  public action:string = "";
  public status:string = "";
  private categories: Array<CategoryInterface> = [];
  public mappedProductsById: {[key: string]: ProductInterface};
  public mappedProductIds: Array<string> = [];
  public mappedPoItems: {[key: string]: any};
  private isProductSelectionView = true;
  private vendors = [];
  public vendor_id = '';
  public userRole = '';
  private cartData: CartSourceInterface;

  public buttonObj: any;

  private errorMessage: string;
  private _success = new Subject<string>();
  constructor(private poService: PurchaseService,
    private purchaseOrderService: PurchaseOrderService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private appSettingsService: AppSettingsService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    this.buttonObj = {
      text: 'Update',
      callback: this.updatePO,
      disabled: false
    };

    this
      .purchaseOrderService
      .getVariants()
      .subscribe((mappedCategories) => {
        console.log(mappedCategories);
      });


    this.route.params.subscribe(params => {
      this.purchaseOrderId = params.id;

      if (!this.purchaseOrderId) {
        return;
      }

      
      // Get PO Details
      this
        .purchaseOrderService
        .getPOData(this.purchaseOrderId)
        .subscribe((response: any) => {
          console.log('PO Data',response.data);
          this.poData = response.data;
          this.puchaseId = this.purchaseOrderId;
          
          console.log('this.poData', this.poData);
          this.userRole = this.authService.getUserRole();
          this.buttonObj = {
            text: 'Update',
            callback: this.updatePO,
            disabled: false
          };

          // if (this.userRole === 'A') {
          //   this.buttonObj.text = 'Approve';
          // }
          
          /*if (this.poData.order_status !== 'PENDING') {
            this.buttonObj.disabled = true;
            console.log('PENDING::', this.buttonObj);
          }*/

          console.log('Role', this.userRole);
        });

      
      const productIds = [];
      const poItemsData = {};
      
      this.purchaseOrderService.getPurchaseOrderItems(this.purchaseOrderId).subscribe((resp: any)  => {
        console.log('mappedProductsById 00', resp.data);
        for (const product of resp.data) {
          // console.log(product);
          if (productIds.indexOf(product.product_id) === -1) {
            productIds.push(product.product_id);
          }
          poItemsData[product.product_variant_sku] = product;
        }

        this.purchaseOrderService
        .getProductDetails(productIds)
        .subscribe((mappedProductsById => {
          console.log('mappedProductsById', mappedProductsById);
          this.mappedProductsById = mappedProductsById;
          this.mappedProductIds = Object.keys(mappedProductsById);
          this.mappedPoItems = poItemsData;
          console.log('mappedProductIds', this.mappedProductIds);
          console.log('mappedPoItems', this.mappedPoItems);
        }));
      });

    });


    this.cartService.resetCartData().then((status) => {
      // Update cart Info
      this.cartService.cart$.subscribe(cartData => {
        console.log('Reset Info',cartData);
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
    
  }

  updatePO() {
    this.userRole = this.authService.getUserRole();

    console.log('poData 00',);
    if(this.action != '') {
      this.status = this.action;
     }else{
      this.status = this.poData.order_status;
     }
    const params = {
      action:this.status,
      vendorID: this.poData.vendor_id,
      cart: this.cartService.contents(),
      OrderId: this.purchaseOrderId,
      role: this.userRole
    };
    
    this.purchaseOrderService.updatePO(params)
      .subscribe( (httpResponse: any) => {

        let modalData: CommonModalInterface = null;
        if (httpResponse && httpResponse.status === 'success') {
          modalData = {
            title: 'Success',
            content: 'Purchase order updated successfully',
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

  back() {
    this.router.navigate(['/purchase/list/']);
  }



}
