import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

// INTERFACES
import { SalesOrderInterface, SalesOrderItemInterface, AddressInterface } from '../../theme/sales-order/sales-order-interfaces';
import { AuthService } from './../auth/auth.service';
@Injectable()
export class SalesOrderService {
  mappedOptionsById: {[key: string]: OptionInterface};
  constructor(private http: HttpClient, private authService: AuthService) { }

   public listOrders(params: any): Observable<HttpResponse<any>> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/sales_order/list/', params, httpOptions);
  }

  public getSalesOrders(params: any): Observable<SalesOrderInterface> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
        .http
        .get<HttpResponse<any>>('/sales_order/info/' + params, httpOptions)
        .map((httpResponse: any) => {
          
          let salesOrder: SalesOrderInterface;

          if(!httpResponse.so_details || !httpResponse.so_items_details) {
            return null;
          }
          let so_details: any = httpResponse.so_details;
          
          let so_items_details: any = httpResponse.so_items_details;

         let refund_amount :any = httpResponse.refund_amount;

          salesOrder = {
            id: so_details.id,
            userInfo: {
                        id: so_details.customer_id,
                        email: so_details.email
                      },
            orderStatus: so_details.order_status,
            tax: so_details.tax,
            orderAmount: so_details.total_amount,
            shippingCost: so_details.total_shipping,
            orderDiscount: so_details.total_discount,
            shippingDiscount: so_details.total_discount_shipping,
            orderType: so_details.type,
            paymentType: so_details.payment_type,
            shipmentMethod: so_details.shipment_method,
            items: [],
            subTotal:httpResponse.sub_total,
            refundAmount:refund_amount.amount,
            orderDate: (new Date(so_details.created_time)).getTime()
          }
          

          // billing address
          if(httpResponse.billing_address) {
            salesOrder.billingAddress = {
              id: httpResponse.billing_address.id,
              firstName: httpResponse.billing_address.first_name,
              lastName: httpResponse.billing_address.last_name,
              address1: httpResponse.billing_address.address1,
              address2: httpResponse.billing_address.address2,
              city: httpResponse.billing_address.city,
              state: httpResponse.billing_address.state,
              country: httpResponse.billing_address.country,
              type: httpResponse.billing_address.type,
              zip: httpResponse.billing_address.zip,
              phoneNumber: httpResponse.billing_address.phone_number
            }
          }

          // shipping address
          if(httpResponse.shipping_address) {
            salesOrder.shippingAddress = {
              id: httpResponse.shipping_address.id,
              firstName: httpResponse.shipping_address.first_name,
              lastName: httpResponse.shipping_address.last_name,
              address1: httpResponse.shipping_address.address1,
              address2: httpResponse.shipping_address.address2,
              city: httpResponse.shipping_address.city,
              state: httpResponse.shipping_address.state,
              country: httpResponse.shipping_address.country,
              type: httpResponse.shipping_address.type,
              zip: httpResponse.shipping_address.zip,
              phoneNumber: httpResponse.shipping_address.phone_number
            }
          }

          for(let item of httpResponse.so_items_details) {
            let itemData: SalesOrderItemInterface = {
              id: item.id,
              name: item.product_variant_name,
              sku: item.sku,
              quantity: item.quantity,
              price: item.unit_price,
              subtotal:null,
            };
            salesOrder.items.push(itemData);
          }

          return salesOrder;
        });
  }

  public getAllSalesOrders(): Observable<HttpResponse<any>> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    let params = {user_role: this.authService.getUserRole(), user_id: this.authService.getUserId()};
    
    return this.http.post<HttpResponse<any>>('/sales_order/sales_orders/', params, httpOptions);
  }

  public updateOrderStatus(params: any): Observable<any> {
    
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this
      .http
      .post<HttpResponse<any>>('/sales_order/update_order_status', params, httpOptions).map(resp => {
        const httpResponse: any = resp;
        console.log(httpResponse);
        return httpResponse;
      })
      .catch(addressError => {
        return Observable.throw(addressError);
      });
  }


  public addNotes(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
        return this
          .http
          .put<HttpResponse<any>>('/sales_order/create', params, httpOptions).map(resp => {
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
        .get<HttpResponse<any>>('/sales_order/notes/' + params, httpOptions);
  }
  public sentOrderEmail(params: any): Observable<any> {
    
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .get<HttpResponse<any>>('/sales_order/send_email_order/' + params, httpOptions);
  }

  public refundAmount(salesOrderId: string, refundType: string, refundAmount:string): Observable<any> {

    let params: HttpParams = new HttpParams();
      params = params.set('so_id', salesOrderId);
      params = params.set('type', refundType);
      params = params.set('amount', refundAmount);

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      params: params
    };

    return this
          .http
          .get<HttpResponse<any>>('/sales_order/refund/', {params: params});
          
    // return this
    // .http
    // .get<HttpResponse<any>>('/sales_order/refund/' + params, httpOptions);
    
  }

  public createShipping(params:any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

  return this
        .http
        .post<HttpResponse<any>>('/sales_order/create_shipping/' , params, httpOptions);

  }


  public getCustomerAddress(params:any): Observable<any> {

      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      };

    return this
          .http
          .post<HttpResponse<any>>('/sales_order/getCustomerAddress/' , params, httpOptions);

    }

    public createCustomer(params:any): Observable<any> {

      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      };

    return this
          .http
          .post<HttpResponse<any>>('/sales_order/createCustomer/' , params, httpOptions);

    }

    public createSO(params: any) {

      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      };
  
      return this.http.post<HttpResponse<any>>('/sales_order/create/', params, httpOptions);
    }

    public getProductDetails(productIds: Array<string>, orderType: string = 'PO',vendorID:string): Observable<{[key: string]: ProductInterface}> {

      let params: HttpParams = new HttpParams();
      params = params.set('order_type', orderType);
      params = params.set('vendor_id', vendorID)
      for (let i = 0; i < productIds.length; i++) {
        params = params.set('product_ids[' + i + ']', productIds[i]);
      }
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: params
      };
  
      return this
        .http
        .get<HttpResponse<any>>('/inventory/productDetails/', {params: params})
        .map((httpResponse: any) => {

          console.log('sales',httpResponse);
  
          if (!httpResponse.data || !Array.isArray(httpResponse.data)) {
            return {};
          }
          const mappedProductsById: {[key: string]: ProductInterface} = {};
          for (const data of httpResponse.data) {
  
            // Map product
            if (!mappedProductsById[data.product_id]) {
              mappedProductsById[data.product_id] = {
                id: data.product_id,
                sku: data.product_sku,
                name: '',
                price: parseFloat(data.price),
                description: '',
                available: true,
                featuredImage: data.p_img,
                images: [],
                options: ['size', 'color'],
                variants: {}
              };
            }
  
            // Prepare variants
            const variant: VariantInterface = {
              id: data.product_variant_id,
              sku: data.variant_sku,
              name: '',
              price: parseFloat(data.price),
              quantity: data.quantity,
              available: true,
              options: [],
              productQuantity: data.vendor_quantity
            };
  
            const variant_ids = data.variant_ids.split(',');
            const variant_value_ids = data.variant_value_ids.split(',');
            if (variant_ids.length && variant_value_ids.length) {
              for (const variant_id of variant_ids) {
                if (this.mappedOptionsById[variant_id]) {
                  const option: OptionInterface = JSON.parse(JSON.stringify(this.mappedOptionsById[variant_id]));
                  for (const variant_value_id of variant_value_ids) {
                   for (const vv of option.values) {
                      if (vv.id === variant_value_id) {
                        option.selectedValue = vv;
                      }
                    }
                  }
                  variant.options.push(option);
                }
              }
            }
  
            mappedProductsById[data.product_id].variants[variant.sku] = variant;
          }
          return mappedProductsById;
        });
    }

    // public getCustomers(vendor_id:any): Observable<any> {
    // // console.log(vendor_id);
    //   const httpOptions = {
    //     headers: new HttpHeaders({'Content-Type': 'application/json'})
    //   };
  
    //   return this
    //           .http
    //           .get<HttpResponse<any>>('/inventory/select_customers/' + vendor_id, httpOptions)
    //           .map( resp => {
    //             console.log(resp);
    //             const httpResponse: any  = resp;
    //             // let ventors: CategryProductInterface;
    //              return httpResponse;
    //            }
    //        );
    // }

    public getCustomers(vendor_id: any): Observable<HttpResponse<any>> {

      const httpParams: HttpParams = new HttpParams().set('vendor_id', vendor_id);

    return this
          .http
          .get<HttpResponse<any>>('/inventory/select_customers/', {params: httpParams});
    }

   

    public getVariants(): Observable<{[key: string]: OptionInterface}> {

      if (this.mappedOptionsById) {
        return Observable.of(this.mappedOptionsById);
      }
  
      return this
        .http
        .get<HttpResponse<any>>('/inventory/all_variants')
        .map((httpResponse: any) => {
          console.log(httpResponse);
          const mappedOptionsById: {[key: string]: OptionInterface} = {};
          if (httpResponse.data) {
            for (const data of httpResponse.data) {
              if (!mappedOptionsById[data.variant_id]) {
                mappedOptionsById[data.variant_id] = {
                  id: data.variant_id,
                  name: data.variant,
                  position: parseInt(data.priority, 10),
                  values: []
                };
              }
  
              const value: OptionValuInterface = {
                id: data.variant_value_id,
                name: data.value,
                shortCode: data.short_code
              };
  
              mappedOptionsById[data.variant_id].values.push(value);
            }
          }
  
          this.mappedOptionsById = mappedOptionsById;
          return mappedOptionsById;
        });
    }

    public listRefundAmounts(params: any): Observable<HttpResponse<any>> {

      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      };
  
      return this.http.post<HttpResponse<any>>('/refunds/list/', params, httpOptions);
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

export interface ProductInterface {
  id: string;
  sku: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  featuredImage: string;
  images: Array<string>;
  options: Array<string>;
  variants: {[key: string]: VariantInterface};
}


export interface OptionInterface {
  id: string;
  name: string;
  position: number;
  selectedValue?: OptionValuInterface;
  values?: Array<OptionValuInterface>;
}

export interface OptionValuInterface {
  id: string;
  name: string;
  shortCode: string;
}

export interface VariantInterface {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  available: boolean;
  options: Array<OptionInterface>;
  orderedQuantity?: number;
  productQuantity:number;
}
