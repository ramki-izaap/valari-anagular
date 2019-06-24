import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class PurchaseService {

  constructor(private http: HttpClient) { }

  public listOrders(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/purchase/list/', params, httpOptions);
  }

  public getOrder(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.get<HttpResponse<any>>('/purchase/orderinfo/' + params, httpOptions).map( resp => {

      const httpResponse: any  = resp;
      const productLists: any = {};

      for (const prod of httpResponse.products) {

        const key: any = prod.id;

        if (typeof productLists[key] === 'undefined') {
          productLists[key] =  {
            sku: prod.sku,
            name: prod.name,
            price: prod.prod_price,
            image: prod.image_name,
            variants: [],
            color: [],
            varform: {}
          };
        }

        if (typeof productLists[key].varform[prod.variant_id] === 'undefined') {

          const obj: any = {
            id: prod.variant_id,
            sku: prod.variant_sku,
            qty: prod.quantity,
            price: prod.price,
            poi_id: prod.poi_id
          };

          obj[prod.variant] = prod.short_code;

          productLists[key].varform[prod.variant_id] = obj;

        } else {
          productLists[key].varform[prod.variant_id][prod.variant] = prod.short_code;
        }

        // Store colors from product wise
        if (prod.priority === '2') {
          productLists[key].color.push({id: prod.variant_value_id, short_code: prod.short_code, value: prod.value});
        }


        // format variants array
        if (Object.keys(productLists[key].varform)) {
          const arr = [];
          for (const ke in productLists[key].varform) {
            if (productLists[key].varform.hasOwnProperty(ke)) {
              arr.push(productLists[key].varform[ke]);
            }
          }
          productLists[key].variants = arr;
        }

        // remove color duplicates
        if (productLists[key].color.length) {
          productLists[key].color = this.removeDuplicates(productLists[key].color, 'fake');
        }
      }

      httpResponse.products = productLists;

      return httpResponse;

    });

  }

  public savePO(paramdata: any) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/purchase/updatepo/', paramdata, httpOptions);
  }


  public productByCategories() {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.get<HttpResponse<any>>('/purchase/product_by_categories/', httpOptions);
  }

  public removeDuplicates(myArr, prop) {

    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj =>
      mapObj[prop]).indexOf(obj[prop]) === pos;
    });

  }

  // RAMAKRISHNAN
  public getProductDetails(productsIds: Array<string>) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .get<HttpResponse<any>>('/purchase/product_by_categories/', httpOptions)
      .map((httpResponse: any) => {
        return httpResponse;
      });
  }

  //SATHISH
  
 


}
