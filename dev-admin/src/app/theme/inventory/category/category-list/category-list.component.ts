import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { IzTableComponent, IzTableInterface } from '../../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { UsersService } from '../../../../services/users/users.service';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { CsvExportCreation } from './category-list.interface';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss',
  //'./../../../../assets/icon/icofont/css/icofont.scss'
]
})
export class CategoryListComponent implements OnInit {
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];
  private csvExport: any;
  constructor(private authService: AuthService, private usersService: UsersService) { }

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
      {name: 'Category Name', prop: 'name', show: true, cellTemplate: this.roleTemplate}
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
          {key: 'name', label: 'Category Name'}
        ],
        selected: 'name',
        value: ''
      },
      bulkAction: {
        selected: '',
        actions: [
          {key: '', label: 'select'},
          // {key: 'print', label: 'Print'},
          // {key: 'delete', label: 'Delete'}
          {key: 'CSV', label: 'Export as CSV'}
        ]
      },
      role:this.authService.getUserRole(),
      userId: this.authService.getUserId()
    };

    this.loadPage();
  }

  doBulkAction() {
    console.log('action', this.izTable.selectedItems);
    let csv : IzTableInterface = {
      // bulkAction: this.izTable.bulkAction,
       currentPage: this.izTable.currentPage,
       perPage: this.izTable.itemsCount,
       pagesCount: this.izTable.pagesCount,
       role: this.izTable.role,
       itemsCount: this.izTable.itemsCount,
       selectedItems: this.izTable.selectedItems,
       userId: this.izTable.userId
      };
       if(this.izTable.selectedItems.all == true){
           this.usersService.listCategory(csv).subscribe((result:any)  => {
             //console.log('csv' + result.items);
             this.csvExport = [];
             for(const csv of result.items){
                 let csvData: CsvExportCreation = {
                   category: csv.name
                 };
               this.csvExport.push(csvData);
             }
            // new Angular5Csv(this.csvExport, 'Variants');
           });
       }
       if(this.izTable.selectedItems.all == false) {
            this.csvExport = []; 
            for(const csv of this.izTable.selectedItems.items){
             let csvData: CsvExportCreation = {
               category: csv.name
             };
           this.csvExport.push(csvData);
         }
       }
   
       var options = { 
         fieldSeparator: ',',
         quoteStrings: '"',
         decimalseparator: '.',
         // showLabels: true, 
         // showTitle: true,
         // useBom: true,
         noDownload: false,
         headers: ["Category"]
       };
   
      new Angular5Csv(this.csvExport, 'Category', options);
     // window.location.reload();
  }

  loadPage = () => {
   // console.log('pageInfo', this.izTable);
    this.usersService.listCategory(this.izTable).subscribe(resp  => {
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows);
    });
  }

}
