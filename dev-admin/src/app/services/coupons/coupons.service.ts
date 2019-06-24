import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class CouponsService {

  constructor(private http: HttpClient) { }

 /// Coupons Part Starts ////
  public listcountries(): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/coupons/list_countries/', httpOptions);
  }



  public coupon_details(params: any, actionType: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
      if(actionType === 'create')
      { 
        return this
          .http
          .put<HttpResponse<any>>('/coupons/create', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(categoryError => {
            return Observable.throw(categoryError);
          });
      } if(actionType === 'update') {
        
        return this
          .http
          .post<HttpResponse<any>>('/coupons/update', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(categoryError => {
            return Observable.throw(categoryError);
          });
      }

  }

    public UploadCSV(file:any): Observable<HttpResponse<any>> {
      const formData: FormData = new FormData();
      formData.append('fileKey', file, file.name);
      const httpOptions = {
        headers: new HttpHeaders({})
      };
      return this.http.post<HttpResponse<any>>('/coupons/coupon_import/', formData, httpOptions);
    }
  
  public liststates(): Observable<HttpResponse<any>> {


    const httpParams: HttpParams = new HttpParams();

  return this
        .http
        .get<HttpResponse<any>>('/coupons/list_states/', {params: httpParams});
  } 


  public listcoupons(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/coupons/couponslist/', params, httpOptions);
  }

  public getCoupons(params: any): Observable<HttpResponse<any>> {
    let data = {id:params};

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .post<HttpResponse<any>>('/coupons/edit_coupons/',data, httpOptions);
  }


  public deleteCoupons(params: any): Observable<HttpResponse<any>> {
   // console.log(params);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.delete<HttpResponse<any>>('/coupons/remove/' + params, httpOptions);
  }
   
}
