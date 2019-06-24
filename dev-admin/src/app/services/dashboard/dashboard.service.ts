import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

// INTERFACES

import { AuthService } from './../auth/auth.service';
@Injectable()
export class DashboardService {
  
  constructor(private http: HttpClient, private authService: AuthService) { }

   public getSalesReportChart(): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    
    let params = new HttpParams()
                  .set('user_role', this.authService.getUserRole())
                  .set('user_id', this.authService.getUserId());

    return this.http.get<HttpResponse<any>>('/dashboard/get_chart_report/', {params: params});
  }

  
}

export interface CategoryInterface {
  id: string;
  name: string;
  selected?: boolean;
  products: Array<CategryProductInterface>;
}

export interface CategryProductInterface {
  id: string;
  name: string;
  sku: string;
  selected?: boolean;
}



