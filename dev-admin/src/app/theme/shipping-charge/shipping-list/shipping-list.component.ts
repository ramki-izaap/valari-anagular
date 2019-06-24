import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../services/auth/auth.service';
import { ShippingChargeService } from '../../../services/shipping-charge/shipping-charge.service'

@Component({
  selector: 'app-shipping-list',
  templateUrl: './shipping-list.component.html',
  styleUrls: ['./shipping-list.component.scss']
})
export class ShippingListComponent implements OnInit {
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('priceTemplate') priceTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];
  public deleteId : any;
  constructor(private authService: AuthService, private router: Router,private ShippingChargeService:ShippingChargeService) { }

  ngOnInit() {

    this.columns = [
      { prop: 'selected',
      name: '',
      sortable: false,
      canAutoResize: false,
      draggable: false,
      resizable: false,
      headerCheckboxable: false,
      checkboxable: true,
      width: 30,
      show: true
      },
      {name: 'Shipping Name', prop: 'shipping_name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Shipping Type', prop: 'shipping_type', show: true, cellTemplate: this.roleTemplate},
      {name: 'Shipping Cost', prop: 'shipping_cost', show: true, cellTemplate: this.priceTemplate},
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
          {key: 'shipping_type', label: 'Shipping Type'},
          //{key: 'shipping_cost', label: 'Shipping Cost'},
        ],
        selected: 'shipping_type',
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
    this.ShippingChargeService.listShippingCharge(this.izTable).subscribe(resp  => {
      console.log('Shipping List',resp);
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows[1]);
    });
  }

  pushToCreateShipping() {
    this.router.navigate(['/shipping-charge/add']);
  }

  edit(id) {
    console.log('DDDDDDDDDDDDDDDDd', id);
    this.router.navigate(['/shipping-charge/add/' + id]);
  }

  delete(id) {
    const status = confirm('are you sure want to delete?');
    if (status) {
     // console.log('delete', id);
      alert('It is in progress..');
      this.deleteId = id;
     // console.log(this.deleteId);
      this.ShippingChargeService.deleteShippingCharge(this.deleteId).subscribe(result => {
        // console.log(result);
        const httpResponse: any = result;
        if (httpResponse.status === 'error') {
          alert(httpResponse.message);
          } 
          else{
          alert(httpResponse.message);
          setTimeout(function(){
          location.reload();
          }, 1000); 
          }
      });
    }
  }
}
