import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewContainerRef  } from '@angular/core';
import {DatatableComponent} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-iz-table',
  templateUrl: './iz-table.component.html',
  styleUrls: ['./iz-table.component.scss']
})
export class IzTableComponent implements OnInit {
  izTable: IzTableInterface;
  columnsFiltered = [];
  allColumns = [];
  @Input()
  set izTableData(input: IzTableInterface) {
    if (typeof input.pageLimits === 'undefined') {
      input.pageLimits = [10, 20, 50, 100];
    }
    this.izTable = input;
  }
  @Input()
  set columns(input: Array<any>) {
    for (const col of input) {
      if (col.show) {
        this.columnsFiltered.push(col);
      }
    }
    this.allColumns = input;
  }
  @Input() rows: any;
  @Output() listChange  = new EventEmitter<any>();
  @Output() doBulkAction  = new EventEmitter<any>();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private displayText: string;
  constructor() {

  }

  ngOnInit() {}

  toggle(col) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columnsFiltered = this.columnsFiltered.filter(c => {
        return c.name !== col.name;
      });
    } else {
      col.show = true;
      this.columnsFiltered = [...this.columnsFiltered, col];
    }

    this.table.ngAfterViewInit();

  }

  isChecked(col) {
    return this.columnsFiltered.find(c => {
      return c.name === col.name;
    });
  }

  onSelect({ selected }) {
    this.izTable.selectedItems.items.splice(0, this.izTable.selectedItems.items.length);
    this.izTable.selectedItems.items.push(...selected);
  }

  onActivate(event) {}

  getDisplayText() {
    const start = (this.izTable.currentPage - 1) * this.izTable.perPage;
  //  console.log('Pagenation');
    let end   = start + this.izTable.perPage;
    if (typeof start === 'string') {
      end   = parseInt(start) + this.izTable.perPage;
    }
    if (typeof this.izTable.perPage === 'string') {
      end   = start + parseInt(this.izTable.perPage);
    }
    if (typeof start === 'string' && typeof this.izTable.perPage === 'string') {
      end   = parseInt(start) + parseInt(this.izTable.perPage);
    } 

    if (end > this.izTable.itemsCount) {
      end = this.izTable.itemsCount;
    }
    
    return 'Showing ' + (start + 1) + ' - ' + end + ' of ' +  this.izTable.itemsCount;
  }

  selectAll($event) {
    console.log(this.izTable.selectedItems);
    if (this.izTable.selectedItems.all) {
      this.izTable.selectedItems.items = this.rows;
    } else {
      this.izTable.selectedItems.items = [];
    }
  }

  bulkAction() {
    if (!this.izTable.selectedItems.items.length) {
      alert('Please select at least one item.');
    } else if (this.izTable.bulkAction.selected === '') {
      alert('Please select an action.');
    } else {
      this.doBulkAction.emit();
    }
  }

  simpleSearch() {
    console.log('this.izTable', this.izTable);
    this.listChange.emit();
  }

  clearSimpleSearch() {
    this.izTable.simpleSearch.selected = '';
    this.izTable.simpleSearch.value = '';
    if (this.izTable.simpleSearch.keys.length) {
      this.izTable.simpleSearch.selected = this.izTable.simpleSearch.keys[0].key;
    }
    this.listChange.emit();
  }

  changePageLimit() {
    console.log('this.izTable', this.izTable);
    this.listChange.emit();
  }
  onSort(event) {
    console.log('sorting', event);
    this.izTable.orderBy = event.column.prop + ' ' + event.newValue;
    this.listChange.emit();
  }

  callLoadPage(currentPage: number) {
    this.izTable.currentPage = currentPage;
    this.listChange.emit();
  }
}

export interface IzTableInterface {
  perPage: number;
  itemsCount: number;
  pagesCount: number;
  currentPage: number;
  selectedItems: {
    all: boolean;
    items: Array<any>;
  };
  orderBy?: string;
  bulkAction?: {
    actions: Array<{key: string, label: string}>,
    selected: string
  };
  simpleSearch?: {
    keys: Array<{key: string, label: string}>,
    selected: string,
    value: string
  };
  advancedSearch?: Array<{[key: string]: string}>;
  pageLimits?: Array<number>;
  role: string;
  userId: number;
}
