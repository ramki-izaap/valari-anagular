import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { PurchaseService } from '../../../services/purchase.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchaseorder-list.html',
  styleUrls: ['./../../../../assets/icon/icofont/css/icofont.scss']
})
export class PurchaseListComponent implements OnInit {

  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('priceTemplate') priceTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];

  constructor(private poService: PurchaseService, private authService: AuthService, private router: Router) {


  }

  ngOnInit() {

    this.columns = [
      { prop: 'selected',
      name: '',
      sortable: true,
      canAutoResize: true,
      draggable: false,
      resizable: true,
      headerCheckboxable: false,
      checkboxable: true
      },
      {name: 'Order#', prop: 'id', show: true, cellTemplate: this.roleTemplate},
      {name: 'Order Total($)', prop: 'total_amount', show: true, cellTemplate: this.priceTemplate},
      {name: 'Created Time', prop: 'created_date', show: true, cellTemplate: this.dateTemplate},
      {name: 'Vendor', prop: 'store_name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Status', prop: 'order_status', show: true, cellTemplate: this.roleTemplate},
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
          {key: 'id', label: 'Order#'},
          {key: 'store_name', label: 'Store Name'},
          {key: 'order_status', label: 'Order Status'},
          {key: 'date', label: 'Date'},
        ],
        selected: 'id',
        value: ''
      },
      bulkAction: {
        selected: '',
        actions: [
          {key: '', label: 'select'},
          {key: 'print', label: 'Print'},
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

    this.poService.listOrders(this.izTable).subscribe(resp  => {
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows[1]);
    });
  }

  view(id: number) {
    this.router.navigate(['/purchase/view/' + id]);
  }

  pushToCreatePO() {
    this.router.navigate(['/purchase/create/']);
  }

}
