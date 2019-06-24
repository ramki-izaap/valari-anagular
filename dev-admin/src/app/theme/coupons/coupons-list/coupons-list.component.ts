import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../services/auth/auth.service';
import { CouponsService } from '../../../services/coupons/coupons.service';
@Component({
  selector: 'app-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit {
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('priceTemplate') priceTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];
  public deleteId: any;
  constructor(private authService: AuthService, private coupons: CouponsService, private router: Router) { }

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
      {name: 'Title', prop: 'title', show: true, cellTemplate: this.roleTemplate},
      {name: 'Code', prop: 'code', show: true, cellTemplate: this.roleTemplate},
      {name: 'Dicount Type', prop: 'discount_type', show: true, cellTemplate: this.roleTemplate},
      {name: 'Amount/Percentage', prop: 'benefit_amt', show: true, cellTemplate: this.roleTemplate},
      {name: 'Start Date', prop: 'start_date', show: true, cellTemplate: this.dateTemplate},
      {name: 'End Date', prop: 'end_date', show: true, cellTemplate: this.dateTemplate},
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
          {key: 'title', label: 'Title'},
          {key: 'code', label: 'Code'},
          {key: 'discount_type', label: 'Dicount Type'},
          {key: 'start_date', label: 'Start Date'},
          {key: 'end_date', label: 'End Date'},
          {key: 'created_time', label: 'Created Time'}
        ],
        selected: 'title',
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
    // console.log('pageInfo', this.izTable);
     this.coupons.listcoupons(this.izTable).subscribe(resp  => {
       const httpResponse: any = resp;
       this.izTable.itemsCount = httpResponse.itemsCount;
       this.izTable.pagesCount = httpResponse.pagesCount;
       this.rows               = httpResponse.items;
       this.izTable.selectedItems.items.push(this.rows[1]);
     });
   }

   editCoupons(id) {
    console.log('edit', id);
    if (id) {
      this.router.navigate(['/coupons/add/' + id]);
    } else {
      this.router.navigate(['/coupons/add/']);
    }

  }

  deleteCoupons(id) {
    const status = confirm('are you sure want to delete this vendor?');
    if (status) {
     // console.log('delete', id);
      alert('It is in progress..');
      this.deleteId = id;
     // console.log(this.deleteId);
      this.coupons.deleteCoupons(this.deleteId).subscribe(result => {
        // console.log(result);
        const httpResponse: any = result;
        if (httpResponse.status === 'error') {
          alert(httpResponse.message);
          } else {
          alert(httpResponse.message);
          setTimeout(function() {
          location.reload();
          }, 1000);
          }
      });
    }
  }

}
