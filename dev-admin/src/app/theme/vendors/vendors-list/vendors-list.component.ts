import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: [
    './vendors-list.component.scss',
    './../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class VendorsListComponent implements OnInit {
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
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
      width: 30,
      show: true
      },
      {name: 'Vendor Name', prop: 'vendor_name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Store Url', prop: 'store_name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Email', prop: 'email', show: true, cellTemplate: this.roleTemplate},
      {name: 'Phone', prop: 'phone_number', show: true, cellTemplate: this.roleTemplate},
      {name: 'State', prop: 'state', show: true, cellTemplate: this.roleTemplate},
      {name: 'Country', prop: 'country', show: true, cellTemplate: this.roleTemplate},
      {name: 'Status', prop: 'status', show: true, cellTemplate: this.statusTemplate},
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
          {key: 'vendor_name', label: 'Vendor Name'},
          {key: 'store_name', label: 'Store Name'},
          {key: 'email', label: 'Email'},
         // {key: 'phone_number', label: 'Phone'}
        ],
        selected: 'store_name',
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
    this.usersService.listVendors(this.izTable).subscribe(resp  => {
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      console.log('dATA',this.rows);
      this.izTable.selectedItems.items.push(this.rows);
    });
  }

  edit(id) {
    console.log('DDDDDDDDDDDDDDDDd', id);
    this.router.navigate(['/vendors/edit/' + id]);
  }

  view(id) {
    this.router.navigate(['/vendors/view/' + id]);
  }

  disableVendor(id) {
    
    const status = confirm('are you sure want to disable this vendor?');
    if (status) {
      this.usersService.vendorDisble(id).subscribe(resp  => {
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
  

  enableVendor(id) {
    
    const status = confirm('are you sure want to enable this vendor?');
    if (status) {
      this.usersService.vendorEnable(id).subscribe(resp  => {
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

  pushToCreatePVendor() {
    this.router.navigate(['/vendors/add']);
  }

}
