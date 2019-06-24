import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: [
    './sales-order-list.component.scss',
    './../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class SalesOrderListComponent implements OnInit {

  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('priceTemplate') priceTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];
  constructor(private authService: AuthService, private usersService: UsersService, private router: Router) {

  }

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
      width: 30
      },
      {name: 'Order Id', prop: 'id', show: true, cellTemplate: this.roleTemplate},
      {name: 'Amount', prop: 'total_amount', show: true, cellTemplate: this.priceTemplate},
      {name: 'Payment Type', prop: 'payment_type', show: true, cellTemplate: this.roleTemplate},
      {name: 'Order Status', prop: 'order_status', show: true, cellTemplate: this.roleTemplate},
      {name: 'Customer Name', prop: 'first_name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Order Date', prop: 'created_time', show: true, cellTemplate: this.dateTemplate},
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
          {key: 'id', label: 'Order Id'},
          {key: 'payment_type', label: 'Payment Type'},
          {key: 'order_status', label: 'Order Status'},
          {key: 'first_name', label: 'Customer Name'},
          {key: 'created_time', label: 'Order Date'},
        ],
        selected: 'order_status',
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
      role:this.authService.getUserRole(),
      userId: this.authService.getUserId()
    };

    this.loadPage();
  }

   doBulkAction() {
    console.log('action', this.izTable.selectedItems);
  }

  loadPage = () => {
    console.log('pageInfo', this.izTable);
    this.usersService.listOrders(this.izTable).subscribe(resp  => {
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows[1]);
    });
  }
  view(id) {
  
   this.router.navigate(['/sales-order/view/' + id]);
  }

  pushToCreateSO() {
    this.router.navigate(['/sales-order/create/']);
  }

}
