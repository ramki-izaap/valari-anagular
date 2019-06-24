
import { Component, OnInit, ViewChild, TemplateRef,ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {transition, trigger, style, animate} from '@angular/animations';
import { IzTableComponent, IzTableInterface } from '../../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { InventoryService } from '../../../../services/inventory/inventory.service';

import { PurchaseOrderService, CategoryInterface, ProductInterface } from '../../../../services/purchase-order/purchase-order.service';
import { CartService, CartSourceInterface} from '../../../../services/cart/cart.service';
import { AppSettingsService, CommonModalInterface } from '../../../../services/app-settings.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import swal from 'sweetalert2';


@Component({
  selector: 'app-vendor-products-list',
  templateUrl: './vendor-products-list.component.html',
  styleUrls: ['./vendor-products-list.component.scss',
    '../../../../../../node_modules/sweetalert2/src/sweetalert2.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})

export class VendorProductsListComponent implements OnInit {

  public downloadURL:string="";
  public showDownloadButton:boolean = false;
  public editing = {};
  
  public productVariants: any = [];
  productID: 0;
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('priceTemplate') priceTemplate: TemplateRef<any>;
  @ViewChild('quantityTemplate') quantityTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];
  private vendors = [];
  public vendor_id = '';
  public userRole = 'A';
  
  constructor(public inventoryService:InventoryService,
             private purchaseOrderService: PurchaseOrderService,
              private cartService: CartService,
              private modalService: NgbModal,
              private appSettingsService: AppSettingsService,
              public router: Router,private authService: AuthService) { }

  ngOnInit() {

    this.columns = [
      { prop: 'selected',
      name: '',
      sortable: false,
      canAutoResize: false,
      draggable: false,
      resizable: false,
      headerCheckboxable: true,
      checkboxable: true,
      width: 30,
      show:true
      },
      {name: 'Product Name', prop: 'name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Sku', prop: 'sku', show: true, cellTemplate: this.roleTemplate},
      {name: 'Quantity', prop: 'quantity', show: true, cellTemplate: this.quantityTemplate},
      {name: 'Price', prop: 'price', show: true, cellTemplate: this.priceTemplate},
      {name: 'Action', prop: 'id', show: true, cellTemplate: this.actionTemplate}
    ];

    this.izTable = {
      perPage: 10,
      itemsCount: 0,
      pagesCount: 0,
      currentPage: 1,
      selectedItems: {
        all: false,
        items: []
      },
      orderBy: 'id desc',
      simpleSearch: {
        keys: [
          {key: 'product_variant_name', label: 'Product Name'},
          {key: 'sku', label: 'Sku'},
          {key: 'quantity', label: 'Quantity'},
          {key: 'price', label: 'Price'}
        ],
        selected: 'product_variant_name',
        value: ''
      },
      bulkAction: {
        selected: '',
        actions: [
          {key: '', label: 'select'},
          {key: 'export', label: 'Export as CSV'},
        ]
      },
      role:this.authService.getUserRole(),
      userId: this.authService.getUserId()
    };
    if (this.authService.getUserRole() === 'V') {
      this.vendor_id = this.authService.getUserId();
      this.userRole = 'V';
    }

    this.loadPage();
  }

  doBulkAction() {
    console.log('action', this.izTable.selectedItems);
    this.inventoryService.downloadFile(this.izTable.selectedItems).subscribe(res=>{
      console.log(res);
      if(res.status === 'success')
      {
        this.downloadURL = res.url;
        this.showDownloadButton = true;
      }
    });
  }

  loadPage = () => {
    console.log('pageInfo', this.izTable);
    this.inventoryService.listProducts(this.izTable).subscribe(resp  => {
      console.log(resp);
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      console.log('rows', this.rows);
      this.izTable.selectedItems.items.push(this.rows[1]);
    });
  }

  delete(id) {
    const status = confirm('are you sure want to delete this product?');
    if (status) {
      console.log('deeee', id);
      let data: any = {id:id,vendorID:this.authService.getUserId()};
      this.inventoryService.deleteProduct(data).subscribe((res)=>{
        console.log(res);
        const httpResponse: any = res;
        alert(httpResponse.message);
        this.loadPage();
     });
      
    }
  }

  createPO(event, column, rowIndex) {
   
    const productVariantsData = this.rows[rowIndex];
    this.editing[rowIndex + '-' + column] = false;
    let updatedQty = parseInt(event.target.value, 10);
    let orderedQuantity = updatedQty - parseInt(productVariantsData.quantity, 10);
    
    if(orderedQuantity <= 0 ){

      const updateQty = { id: productVariantsData.id, quantity: updatedQty};

      this
      .purchaseOrderService
      .updateQuantity(updateQty)
      .subscribe( (httpResponse: any) => {

        let modalData: CommonModalInterface = null;
        if (httpResponse && httpResponse.status === 'success') {

          modalData = {
            title: 'Success',
            content: 'Product Quantity updated successfully',
            beforeDismiss: () => {
              this.loadPage();
            }
          };
        } else {
          modalData = {
            title: 'Error',
            content: httpResponse.message,
            beforeDismiss: () => {}
          };
        }
        this.appSettingsService.setCommonModalData(modalData);
      });
      
    } else {

      let item = {
        id: productVariantsData.id,
        orderedQuantity: orderedQuantity,
        price: productVariantsData.price
      };
  
      const params = { vendorID: this.vendor_id, cart: [item]};
      
      this
        .purchaseOrderService
        .createPO(params)
        .subscribe( (httpResponse: any) => {
  
          let modalData: CommonModalInterface = null;
          if (httpResponse && httpResponse.status === 'success') {
  
            modalData = {
              title: 'Success',
              content: 'Product Quantity updated successfully',
              beforeDismiss: () => {
                this.loadPage();
              }
            };
          } else {
            modalData = {
              title: 'Error',
              content: httpResponse.message,
              beforeDismiss: () => {}
            };
          }
          this.appSettingsService.setCommonModalData(modalData);
     });

    }

    
  }

  
}
