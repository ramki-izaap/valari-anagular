
import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {transition, trigger, style, animate} from '@angular/animations';
import { IzTableComponent, IzTableInterface } from '../../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { InventoryService } from '../../../../services/inventory/inventory.service';

import swal from 'sweetalert2';




@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss',
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
export class ProductListComponent implements OnInit {
  // uploadForm : FormGroup;
  public fileToUpload = '';
  public import_type = '';
  public div1 = true;
  public div2 = false;
  public div3 = false;
  public div4 = false;
  public import_error = false;
  public file_error = false;
  public showConfirmButtom = false;
  public up_error = '';
  public download_csv_type = '';
  public csv_download_url = './docs/product-import.csv';
  public filepath = '';
  public errors = [];
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
  @ViewChild('priceTemplate') priceTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];

  constructor(public inventoryService: InventoryService,
              public router: Router, private authService: AuthService) { }

  ngOnInit() {

    this.columns = [
      { 
        prop: 'selected',
        name: '',
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizable: false,
        headerCheckboxable: false,
        checkboxable: true,
        width: 30
      },
      {name: 'Product Name', prop: 'name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Sku', prop: 'sku', show: true, cellTemplate: this.roleTemplate},
      {name: 'Price', prop: 'price', show: true, cellTemplate: this.priceTemplate},
      {name: 'Status', prop: 'is_active', show: true, cellTemplate: this.statusTemplate},
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
          {key: 'name', label: 'Product Name'},
          {key: 'sku', label: 'Sku'},
          {key: 'price', label: 'Price'}
        ],
        selected: 'name',
        value: ''
      },
      bulkAction: {
        selected: '',
        actions: [
          {key: '', label: 'select'},
          {key: 'print', label: 'Print'},
          {key: 'delete', label: 'Delete'}
        ]
      },
      role: this.authService.getUserRole(),
      userId: this.authService.getUserId()
    };

    this.loadPage();
  }

  doBulkAction() {
    console.log('action', this.izTable.selectedItems);
  }

  loadPage = () => {
    console.log('pageInfo', this.izTable);
    this.inventoryService.listProducts(this.izTable).subscribe(resp  => {
      console.log(resp);
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows[1]);
    });
  }

  edit(id) {
    console.log('DDDDDDDDDDDDDDDDd', id);
    this.router.navigate(['product/view/' + id]);
  }

  // delete(id) {
  //   const status = confirm('are you sure want to delete this product?');
  //   if (status) {
  //     console.log('deeee', id);
  //     let data: any = {id:id,role:this.authService.getUserRole()};
  //     this.inventoryService.deleteProduct(data).subscribe((res)=>{
  //       console.log(res);
  //       const httpResponse: any = res; 
  //       alert(httpResponse.message);
  //         this.loadPage();
  //    });
      
  //   }
  // }

  onFileChange(event) {
    const filename = event.target.files.item(0);
    this.fileToUpload = filename;
    console.log(filename);
  }

  uploadSubmit() {
    console.log(this.import_type);
    console.log(this.fileToUpload);
    if (this.import_type === '' || this.fileToUpload === '') {
      if (this.import_type === '') {
        this.import_error = true;
      } else {
        this.import_error = false;
      }

      if (this.fileToUpload === '') {
        this.file_error = true;
      } else {
        this.file_error = false;
      }
    } 
    else 
    {
      document.querySelector('#effect-1').classList.add('md-show');
      console.log(this.fileToUpload);
      this.inventoryService.uploadCSV(this.import_type, this.fileToUpload).subscribe(data => {
        console.log('Upload Response', data);
        if (data['res_status'] === 'error') {
          this.div1 = false;
          this.div3 = true;
          this.up_error = data['error'];
        } 
        else 
        {
            this.div1 = false;
            // do something, if upload success
            const upload_response = data['response'];

            if (upload_response.status === 'error') {

              if( upload_response.type === 'columns' ) {
                this.showConfirmButtom = false;
              } 
              else 
              {
                this.showConfirmButtom = true;
                this.filepath = data['file_path'];
              }
              
              this.div2   = true;
              this.errors = upload_response.errors;

            }

            if (upload_response.status === 'success') {
              this.loadPage();
              this.div1 = this.div2 = this.div3  = false;
              this.showConfirmButtom = false;
              this.div4 = true;
            }

            console.log(upload_response);
         }

        }, 
        error => {
          console.log(error);
        });
    }
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  confirmUpload() {
    this.div1 = true;
    this.div2 = this.div3 = false;
    console.log('Filepath', this.filepath);
    this.inventoryService.uploadCSV(this.import_type, this.filepath, 'confirm').subscribe(data => {
      const upload_response = data['response'];
      if (upload_response.status === 'success') {
        this.div1 = this.div2 = this.div3  = false;
        this.showConfirmButtom = false;
        this.div4 = true;
      }
    });
  }

  onSelectChange(event) {
    this.import_type = event.target.value;
    console.log(this.import_type);
  }

  onDownloadTypeChange(event) {
    this.download_csv_type = event.target.value;
    if (this.download_csv_type === '1') {
      this.csv_download_url = './docs/product-import.csv';
    } else {
      this.csv_download_url = './docs/product-update.csv';
    }
  }

  downloadCSV() {
    if (this.download_csv_type === '') {
      alert('Please Select download CSV type');
      return false;
    }
  }

  pushToCreateProduct() {
    this.router.navigate(['/product/add']);
  }

  disableProduct(id) {
    
    const status = confirm('are you sure want to disable this product?');
    if (status) {
      this.inventoryService.productDisble(id).subscribe(resp  => {
        const httpResponse: any = resp;
        if (httpResponse.status === 'error') {
        alert(httpResponse.message);
        } 
        else{
          alert(httpResponse.message);
          this.loadPage();
        }
      });
    }
  }
  
  enableProduct(id) {
    
    const status = confirm('are you sure want to enable this product?');
    if (status) {
      this.inventoryService.productEnable(id).subscribe(resp  => {
        const httpResponse: any = resp;
        if (httpResponse.status === 'error') {
        alert(httpResponse.message);
        } 
        else{
          alert(httpResponse.message);
          this.loadPage();
        }
      });
    }
  }

}

