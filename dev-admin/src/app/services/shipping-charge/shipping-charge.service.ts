import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


import { ShippingChargeInterface } from './../../theme/shipping-charge/shipping-add/shipping-charge-add.interface';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ShippingChargeService {

  constructor(private http: HttpClient) { }

  public listShippingCharge(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/shipping_charge/list/', params, httpOptions);
  }


   //get shipping
   public getShippingCharge(params: any): Observable<ShippingChargeInterface> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
        .http
        .get<HttpResponse<any>>('/shipping_charge/info/' + params, httpOptions)
        .map(resp => {
          const httpResponse: any = resp;
          let shippingCharge: ShippingChargeInterface = null;
          if (httpResponse.status && httpResponse.status === 'success') {
            shippingCharge = {
              shippingName: httpResponse.info.shipping_name,
              userId: httpResponse.info.id,
              shippingType: httpResponse.info.shipping_type,
              shippingCost: httpResponse.info.shipping_cost ,
            };
          }
          return shippingCharge;
        });
  }

   /**
   * createShipping
   */
  public createShippingCharge(user: ShippingChargeInterface) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
          .http
          .put<HttpResponse<any>>('/shipping_charge/create', user, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(vendorError => {
            return Observable.throw(vendorError);
          });
  }

  /**
   * updateShipping
   */
  public updateShippingCharge(user: ShippingChargeInterface) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
          .http
          .post<HttpResponse<any>>('/shipping_charge/update', user, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(vendorError => {
            return Observable.throw(vendorError);
          });
  }


  public deleteShippingCharge(params: any): Observable<HttpResponse<any>> {
   // console.log(params);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.delete<HttpResponse<any>>('/shipping_charge/remove/' + params, httpOptions);
  }
   
}
