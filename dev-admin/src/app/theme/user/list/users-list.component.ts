import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { IzTableComponent, IzTableInterface } from '../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: [
    './../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class UsersListComponent implements OnInit {
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
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
      {name: 'First Name', prop: 'first_name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Last Name', prop: 'last_name', show: true, cellTemplate: this.roleTemplate},
      {name: 'Email', prop: 'email', show: true, cellTemplate: this.roleTemplate},
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
          {key: 'first_name', label: 'First Name'},
          {key: 'last_name', label: 'Last Name'},
          {key: 'email', label: 'Email'}
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
    this.usersService.listUsers(this.izTable).subscribe(resp  => {
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows);
    });
  }

  edit(id) {
    console.log('DDDDDDDDDDDDDDDDd', id);
    this.router.navigate(['/user/add/' + id]);
  }

  view(id){
    this.router.navigate(['/user/view/' + id]);
  }

  pushToCreateUser() {
    this.router.navigate(['/user/add']);
  }



}
