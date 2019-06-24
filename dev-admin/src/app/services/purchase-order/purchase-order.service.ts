import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
// INTERFACES
import { SalesOrderInterface, SalesOrderItemInterface, AddressInterface } from '../../theme/sales-order/sales-order-interfaces';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class PurchaseOrderService {
  mappedOptionsById: {[key: string]: OptionInterface};
  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * getPOData
   */
  public getPOData(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.get<HttpResponse<any>>('/purchase/order/' + id, httpOptions).map( resp => {
      const httpResponse: any  = resp;
      return httpResponse;
    });
  }
  /**
   * getVariants
   */
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

  /**
   * getProductsByCategory
   */
  public getParentProductsByCategory(orderType: string): Observable<Array<CategoryInterface>> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    let params: HttpParams = new HttpParams();
    if (this.authService.getUserRole() === 'V') {
      params = params.set('vendor_id', this.authService.getUserId());
      params = params.set('order_type', orderType);
    } else {
      params = params.set('order_type', orderType);
    }
    
    return this
      .http
      .get<HttpResponse<any>>('/inventory/parentProductsByCategories', {params: params})
      .map((httpResponse: any) => {

        const categories: Array<CategoryInterface> = [];

        if (!httpResponse.status || httpResponse.status !== 'success') {
         return categories;
        }

        if (!httpResponse.data || !Array.isArray(httpResponse.data)) {
          return categories;
        }

        // Prepare categories
        const temp: {[key: string]: CategoryInterface} = {};
        for (const item of httpResponse.data) {
          if (typeof temp[item.category_id] === 'undefined') {
            temp[item.category_id] = {
              id: item.category_id,
              name: item.category_name,
              selected: false,
              products: []
            };
          }

          const product: CategryProductInterface = {
            id: item.product_id,
            name: item.product_name,
            sku: item.sku,
            selected: false,
          };

          temp[item.category_id].products.push(product);

        }

        // Convert as Array
        const keys = Object.keys(temp);
        for (const cat of keys) {
          categories.push(temp[cat]);
        }

        return categories;
      });
  }

  /**
   * getProductDetails
   * @param productIds
   */
  public getProductDetails(productIds: Array<string>): Observable<{[key: string]: ProductInterface}> {

    let params: HttpParams = new HttpParams();
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

        if (!httpResponse.data || !Array.isArray(httpResponse.data)) {
          return {};
        }
        const mappedProductsById: {[key: string]: ProductInterface} = {};
        for (const data of httpResponse.data) {

          // Map product
          if (!mappedProductsById[data.product_id]) {
            mappedProductsById[data.product_id] = {
              id: data.product_id,
              categoryId: data.category_id,
              categoryIds: data.category_ids,
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
            productQuantity: data.vendor_quantity,
            isActive: (data.variant_status === '0' ? false : true)
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

  public getVendors(): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
            .http
            .get<HttpResponse<any>>('/inventory/get_ventors/', httpOptions)
            .map( resp => {
              const httpResponse: any  = resp;
              // let ventors: CategryProductInterface;
               return httpResponse;
             }
         );
  }

  public getCustomers(): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this
            .http
            .get<HttpResponse<any>>('/inventory/get_customers/', httpOptions)
            .map( resp => {
              const httpResponse: any  = resp;
              // let ventors: CategryProductInterface;
               return httpResponse;
             }
         );
  }

  public updateAddress(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
        return this
          .http
          .post<HttpResponse<any>>('/purchase/create_po', params, httpOptions).map(resp => {
            const httpResponse: any = resp;
            console.log(httpResponse);
            return httpResponse;
          })
          .catch(addressError => {
            return Observable.throw(addressError);
          });
  }
  public createPO(params: any) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/purchase/create/', params, httpOptions);
  }


  public updatePO(params: any) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/purchase/update/', params, httpOptions);
  }
  public getPurchaseOrderItems(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.get<HttpResponse<any>>('/purchase/purchase_order_items/' + params, httpOptions).map( resp => {
      const httpResponse: any  = resp;
        return httpResponse;
    });

  }

  public getAllPurcahseOrders(): Observable<HttpResponse<any>> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    let params = {user_role: this.authService.getUserRole()};
    
    return this.http.post<HttpResponse<any>>('/purchase/get_purchase_orders/', params, httpOptions);
  }

  public updateQuantity(params: any) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/purchase/update_quantity/', params, httpOptions);
  }

  public getVendorProductItems(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.get<HttpResponse<any>>('/purchase/vendor_product_items/' + params, httpOptions).map( resp => {
      const httpResponse: any  = resp;
        return httpResponse;
    });

  }

  public createvendorProducts(params: any) {

    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    return this.http.post<HttpResponse<any>>('/purchase/vendor_products/', params, httpOptions);
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
  categoryId: string;
  categoryIds: string;
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
  isActive: boolean;
}

