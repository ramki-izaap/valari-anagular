import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

// INTERFACES
import { VendorInetrface } from './../../theme/vendors/vendors-add/vendors-add.interface';
import { UserInetrface } from './../../theme/user/user-add/user-add.interface';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromEvent';
@Injectable()
export class UsersService {

  constructor(private http: HttpClient) { }

  public listUsers(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/users/list/', params, httpOptions);
  }


  public vendor(params: any, actionType: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    if (actionType === 'create') {
        return this
          .http
          .put<HttpResponse<any>>('/vendors/create', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(vendorError => {
            return Observable.throw(vendorError);
          });
    } else {
      return this
      .http
      .post<HttpResponse<any>>('/vendors/update', params, httpOptions).map(resp => {
        const httpResponse: any = resp;
        console.log(httpResponse);

        return httpResponse;
      })
      .catch(loginError => {
        return Observable.throw(loginError);
      });
    }
  }

  // Remove vendors
   public removeVendor(params: any): Observable<HttpResponse<any>> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.delete<HttpResponse<any>>('vendor/remove/' + params, httpOptions);
  }



  public listVendors(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/vendors/list/', params, httpOptions);
  }

  //Change status
  public vendorDisble(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .post<HttpResponse<any>>('/vendors/vendor_disable', {id:params},httpOptions).map(resp => {
        const httpResponse: any = resp;
        return httpResponse;
      })
      .catch(UpdateError => {
        return Observable.throw(UpdateError);
      });
  }

  //Change status
  public vendorEnable(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .post<HttpResponse<any>>('/vendors/vendor_enable', {id:params},httpOptions).map(resp => {
        const httpResponse: any = resp;
        return httpResponse;
      })
      .catch(UpdateError => {
        return Observable.throw(UpdateError);
      });
  }


  // forgot password
  public forgotPassword(email: any): Observable<HttpResponse<any>> {


    const httpParams: HttpParams = new HttpParams().set('email', email);

    return this
            .http
            .get<HttpResponse<any>>('/users/forgotpassword/', {params: httpParams});
  }

  //get All users
  // public getUsers(role: any): Observable<HttpResponse<any>> {


  //   const httpParams: HttpParams = new HttpParams().set('role', role);

  //   return this
  //           .http
  //           .get<HttpResponse<any>>('/users/get_users/', {params: httpParams});
  // }

  public getUsers(role: any, uid): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .get<HttpResponse<any>>('/users/get_users/' + role + '/'+ uid, httpOptions);
  }

  // public getUsers(): Observable<any> {

  //   const httpOptions = {
  //     headers: new HttpHeaders({'Content-Type': 'application/json'})
  //   };

  //   return this
  //           .http
  //           .get<HttpResponse<any>>('/users/get_users/', httpOptions)
  //           .map( resp => {
  //             const httpResponse: any  = resp;
  //             // let ventors: CategryProductInterface;
  //              return httpResponse;
  //            }
  //        );
  // }

  public changePassword (id: any, password: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
        .http
        .post<HttpResponse<any>>('/users/change_password/', { id: id, password: password }, httpOptions).map(resp => {
          const httpResponse: any = resp;
          console.log(httpResponse);
          return httpResponse;
        })
        .catch(changePasswordError => {
          return Observable.throw(changePasswordError);
        });
  }

  public profileUpdate(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .post<HttpResponse<any>>('/users/profiles', params, httpOptions).map(resp => {
        const httpResponse: any = resp;
        console.log(httpResponse);
        localStorage.setItem('user_data', JSON.stringify(httpResponse.user_info));
        return httpResponse;
      })
      .catch(profileUpdateError => {
        return Observable.throw(profileUpdateError);
      });
  }

/// Category Part Starts ////
  public category(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
        return this
          .http
          .put<HttpResponse<any>>('/category/create', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(categoryError => {
            return Observable.throw(categoryError);
          });
  }

  public listCategory(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/category/list/', params, httpOptions);
  }


  // update shipping cost
  public shippingSetting(params: any, user_id: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    const data: any = {shipping_cost: params, key: 'shipping', user_id: user_id};

    return this
      .http
      .post<HttpResponse<any>>('/users/shipping_settings', data, httpOptions).map(resp => {
        const httpResponse: any = resp;
        console.log(httpResponse);
        return httpResponse;
      })
      .catch(profileUpdateError => {
        return Observable.throw(profileUpdateError);
      });

  }
  
  // get shipping cost
  public getShippingCost(user_id: any): Observable<HttpResponse<any>> {

    const httpParams: HttpParams = new HttpParams().set('user_id', user_id).set('key', 'shipping');

  return this
        .http
        .get<HttpResponse<any>>('/users/shipping_settings/', {params: httpParams});
  }

   public listOrders(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/sales_order/list/', params, httpOptions);
  }

  public getSalesOrders(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .get<HttpResponse<any>>('/sales_order/info/' + params, httpOptions);
  }

   public getOrdersItem(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .get<HttpResponse<any>>('/sales_order/get_orders/' + params, httpOptions);
  }



  // public getProducts(params: any): Observable<any> {

  //   const httpOptions = {
  //     headers: new HttpHeaders({'Content-Type': 'application/json'})
  //   };

  //  return this.http.put<HttpResponse<any>>('/sales_order/get_products/', params, httpOptions);

  // }

  public addNotes(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
        return this
          .http
          .put<HttpResponse<any>>('/sales_order/create_note', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(notesError => {
            return Observable.throw(notesError);
          });
  }

  public updateAddress(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
        return this
          .http
          .post<HttpResponse<any>>('/sales_order/update', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(addressError => {
            return Observable.throw(addressError);
          });
  }

  public getAddress(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .get<HttpResponse<any>>('/sales_order/shipping_address/' + params, httpOptions);
  }
  public getNotes(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .post<HttpResponse<any>>('/sales_order/notes/' , params, httpOptions);
  }
  public sentOrderEmail(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .get<HttpResponse<any>>('/sales_order/send_email_order/' + params, httpOptions);
  }

  public refundAmount(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .post<HttpResponse<any>>('/sales_order/refund_amount/' , params, httpOptions);
  }

  public getLogs(params: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .post<HttpResponse<any>>('/logs/get_logs/' , params, httpOptions);
  }

  /**
   * checkEmailNotTaken
   */
  public getStoreByName(storeName: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .get<HttpResponse<any>>('/stores/' + storeName, httpOptions);
  }

  public getVendor(params: any): Observable<VendorInetrface> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
        .http
        .get<HttpResponse<any>>('/vendors/info/' + params, httpOptions)
        .map(resp => {
          const httpResponse: any = resp;
          let vendor: VendorInetrface = null;
          if (httpResponse.status && httpResponse.status === 'success') {
            vendor = {
              userId: httpResponse.info.user_id,
              vendorName: httpResponse.info.vendor_name,
              boutiqueName: httpResponse.info.boutique_name,
              storeName: httpResponse.info.store_name,
              priceId: httpResponse.info.vendor_price_config_id,
              email: httpResponse.info.email,
              phoneNumber: httpResponse.info.phone_number,
              shippingRate: httpResponse.info.shipping_rate,
              //returnPolicy: httpResponse.info.return_policy,
              returnShippingRate: httpResponse.info.return_shipping_rate,
              address1: httpResponse.info.address1,
              address2: httpResponse.info.address2,
              city: httpResponse.info.city,
              state: httpResponse.info.state,
              country: httpResponse.info.country,
              zip: httpResponse.info.zip,
              status:httpResponse.info.status
              // retaddress1: httpResponse.info.ra_address1,
              // retaddress2: httpResponse.info.ra_address2,
              // retcity: httpResponse.info.ra_city,
              // retstate: httpResponse.info.ra_state,
              // retcountry: httpResponse.info.ra_country,
              // retzip: httpResponse.info.ra_zip
            };
          }
          return vendor;
        });
  }

  /**
   * createVendor
   */
  public createVendor(vendor: VendorInetrface,file) {

    const httpOptions = {
      headers: new HttpHeaders()
    };

    const formData: FormData = new FormData();
    
    formData.append('boutiqueName',vendor.boutiqueName);
    formData.append('vendorName',vendor.vendorName);
    formData.append('storeName',vendor.storeName);
    formData.append('userId',vendor.userId);
    formData.append('priceId',vendor.priceId);
    formData.append('email',vendor.email);
    formData.append('phoneNumber',vendor.phoneNumber);
    formData.append('address1',vendor.address1);
    formData.append('address2',vendor.address2);
    formData.append('city',vendor.city);
    formData.append('state',vendor.state);
    formData.append('country',vendor.country);
    formData.append('zip',vendor.zip);
    formData.append('returnShippingRate',vendor.returnShippingRate);
    formData.append('shippingRate',vendor.shippingRate);
    if(file){
      formData.append('fileKey', file, file.name);
    }
   
    return this
          .http
          .post<HttpResponse<any>>('/vendors/create', formData, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(vendorError => {
            return Observable.throw(vendorError);
          });
  }

  /**
   * updateVendor
   */
  public updateVendor(vendor: VendorInetrface, file) {

    const httpOptions = {
      headers: new HttpHeaders()
    };

    const formData: FormData = new FormData();
    
    formData.append('boutiqueName',vendor.boutiqueName);
    formData.append('vendorName',vendor.vendorName);
    formData.append('storeName',vendor.storeName);
    formData.append('userId',vendor.userId);
    formData.append('priceId',vendor.priceId);
    formData.append('email',vendor.email);
    formData.append('phoneNumber',vendor.phoneNumber);
    formData.append('address1',vendor.address1);
    formData.append('address2',vendor.address2);
    formData.append('city',vendor.city);
    formData.append('state',vendor.state);
    formData.append('country',vendor.country);
    formData.append('zip',vendor.zip);
    formData.append('returnShippingRate',vendor.returnShippingRate);
    formData.append('shippingRate',vendor.shippingRate);
    if(file){
      formData.append('fileKey', file, file.name);
    }

    return this
          .http
          .post<HttpResponse<any>>('/vendors/update', formData, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(vendorError => {
            return Observable.throw(vendorError);
          });
  }

  public getPaymentInfo(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    
  return this
        .http
        .get<HttpResponse<any>>('/users/get_paymentinfo/' + params, httpOptions);
  }

  public SavePaypal(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .post<HttpResponse<any>>('/users/create_paypal', params, httpOptions);
  }

  public SaveAuthorize(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
      .http
      .post<HttpResponse<any>>('/users/create_authorize', params, httpOptions);
  }

  public listVendorsConfig(): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/vendors/list_price_config/', httpOptions);
  }

  //get user
  public getUser(params: any): Observable<UserInetrface> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
        .http
        .get<HttpResponse<any>>('/users/info/' + params, httpOptions)
        .map(resp => {
          const httpResponse: any = resp;
          let user: UserInetrface = null;
          if (httpResponse.status && httpResponse.status === 'success') {
            user = {
              userId: httpResponse.info.id,
              firstName: httpResponse.info.first_name,
              lastName: httpResponse.info.last_name ,
              password: httpResponse.info.password,
              email: httpResponse.info.email,
              
            };
          }
          return user;
        });
  }

   /**
   * createUser
   */
  public createUser(user: UserInetrface) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
          .http
          .put<HttpResponse<any>>('/users/create', user, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(vendorError => {
            return Observable.throw(vendorError);
          });
  }

  /**
   * updateUser
   */
  public updateUser(user: UserInetrface) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
          .http
          .post<HttpResponse<any>>('/users/update', user, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(vendorError => {
            return Observable.throw(vendorError);
          });
  }

}
