import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../services/auth/auth.service';
import { SalesOrderService } from '../../../services/sales-order/sales-order.service';

@Component({
  selector: 'app-refunds-list',
  templateUrl: './refunds-list.component.html',
  styleUrls: ['./refunds-list.component.scss']
})
export class RefundsListComponent implements OnInit {
  
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  //@ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('priceTemplate') priceTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];

  constructor(private authService: AuthService,
     private router: Router,private salesOrderService: SalesOrderService) {

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
        {name: 'Order Id', prop: 'sales_id', show: true, cellTemplate: this.roleTemplate},
        {name: 'Customer Name', prop: 'first_name', show: true, cellTemplate: this.roleTemplate},
        {name: 'Amount', prop: 'amount', show: true, cellTemplate: this.priceTemplate},
        {name: 'Order Date', prop: 'created_date', show: true, cellTemplate: this.dateTemplate}
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
        orderBy: 'sales_id desc',
        simpleSearch: {
          keys: [
            {key: 'sales_id', label: 'Order Id'},
            {key: 'first_name', label: 'Customer Name'},
            {key: 'amount', label: 'Amount'},
            {key: 'created_date', label: 'Order Date'},
          ],
          selected: 'first_name',
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
    this.salesOrderService.listRefundAmounts(this.izTable).subscribe(resp  => {
     // console.log(resp);
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows[1]);
    });
  }


}
