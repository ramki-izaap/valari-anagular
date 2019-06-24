import { Component, OnInit,ViewChild, TemplateRef  } from '@angular/core';
import { IzTableComponent, IzTableInterface } from '../../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { InventoryService } from '../../../../services/inventory/inventory.service';
@Component({
  selector: 'app-variants-value-list',
  templateUrl: './variants-value-list.component.html',
  styleUrls: ['./variants-value-list.component.scss']
})
export class VariantsValueListComponent implements OnInit {
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];
  constructor(private authService: AuthService, private inventory: InventoryService) { }

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
      {name: 'Variants Name', prop: 'variant', show: true, cellTemplate: this.roleTemplate},
      {name: 'Variants Value', prop: 'value', show: true, cellTemplate: this.roleTemplate},
      {name: 'Short Code', prop: 'short_code', show: true, cellTemplate: this.roleTemplate}
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
      simpleSearch: {
        keys: [
          {key: 'variant', label: 'Variants Name'},
          {key: 'value', label: 'Variants Value'},
          {key: 'short_code', label: 'Short Code'}
        ],
        selected: 'variant',
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
   // console.log('pageInfo', this.izTable);
    this.inventory.listvariantsvalue(this.izTable).subscribe(resp  => {
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows[1]);
    });
  }

}
