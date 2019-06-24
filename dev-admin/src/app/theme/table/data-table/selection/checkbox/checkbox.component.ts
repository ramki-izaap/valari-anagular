import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../../services/auth/auth.service';
@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: [
    './checkbox.component.scss',
    '../../../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class CheckboxComponent implements OnInit {
  rows: any = [];
  selected = [];
  page: any = {};
  constructor(private http: HttpClient, private authService: AuthService) {
    // this.fetch((data) => {
    //   this.rows = data;
    // });
    this.page = {
      size: 10,
      totalElements: 0,
      totalPages: 0,
      pageNumber: 0
    };
  }

  ngOnInit() {
    this.setPage({ offset: 0 });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {}

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }

  setPage(pageInfo) {
    console.log('pageInfo', pageInfo);
    this.page.pageNumber = pageInfo.offset;
    this.authService.listUsers(this.page).subscribe(pagedData  => {
      this.page = pagedData['page'];
      this.rows = pagedData['data'];
    });
  }
}
