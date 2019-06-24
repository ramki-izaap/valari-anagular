import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { IzTableComponent, IzTableInterface } from '../../../../shared/iz-table/iz-table.component';
import { AuthService } from '../../../../services/auth/auth.service';
import { InventoryService } from '../../../../services/inventory/inventory.service';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { CsvExportCreation } from './variants-list.interface';
import { AppSettingsService, CommonModalInterface } from '../../../../services/app-settings.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-variants-list',
  templateUrl: './variants-list.component.html',
  styleUrls: ['./variants-list.component.scss']
})
export class VariantsListComponent implements OnInit {
  @ViewChild(IzTableComponent) child: IzTableComponent;
  @ViewChild('roleTemplate') roleTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  izTable: IzTableInterface;
  columns: any = [];
  rows: any = [];

  private csvExport: any;
  constructor(private authService: AuthService, private inventory: InventoryService,private appSettingsService: AppSettingsService,
    private router: Router) { }

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
      {name: 'Variants Name', prop: 'variant', show: true, cellTemplate: this.roleTemplate},
      {name: 'Value', prop: 'value', show: true, cellTemplate: this.roleTemplate},
      {name: 'Short Code', prop: 'short_code', show: true, cellTemplate: this.roleTemplate},
      {name: 'Action', prop: 'vvid', show: true, cellTemplate: this.actionTemplate}
    ];

    this.izTable = {
      perPage: 50,
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
          {key: 'value', label: 'Value'},
          {key: 'short_code', label: 'Short Code'}
        ],
        selected: 'variant',
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

    setTimeout(() => {
      
    }, 5000);
  }

  doBulkAction() {
   console.log('action', this.izTable, this.izTable.selectedItems);
   
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
        this.inventory.listvariants(csv).subscribe((result:any)  => {
          //console.log('csv' + result.items);
          this.csvExport = [];
          for(const csv of result.items){
              let csvData: CsvExportCreation = {
                variant: csv.variant,
                value: csv.value,
                shortCode: csv.short_code
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
            variant: csv.variant,
            value: csv.value,
            shortCode: csv.short_code
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
      headers: ["Variant", "Name", "Short Code"]
    };

   new Angular5Csv(this.csvExport, 'Variants', options);
  // window.location.reload();
  }

  loadPage = () => {
   // console.log('pageInfo', this.izTable);
    this.inventory.listvariants(this.izTable).subscribe(resp  => {
      const httpResponse: any = resp;
      this.izTable.itemsCount = httpResponse.itemsCount;
      this.izTable.pagesCount = httpResponse.pagesCount;
      this.rows               = httpResponse.items;
      this.izTable.selectedItems.items.push(this.rows);
    });
  }

  delete = (id : number) => {
      this.inventory.deleteVariantsValue(id).subscribe(result => {
        const httpResponse : any = result;
        let modalData: CommonModalInterface = null;
        if (httpResponse.status === 'success') {
          const confirmation = confirm('are you sure want to delete this variant ?');
          if(confirmation){
             this.showPopup('Sucess', httpResponse.message, true);
          }                  
        } else {
          this.showPopup('Error', httpResponse.message, false);
        }                
      });
  }

  private showPopup(status: string = 'Success', message: string = '', reload: boolean = false) {
    let modalData: CommonModalInterface = null;
      modalData = {
        title: status,
        content: message,
        beforeDismiss: () => {
          if (reload) {
            this.loadPage();
          }          
        }
      };

      this.appSettingsService.setCommonModalData(modalData);
  }

}
