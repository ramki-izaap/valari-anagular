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
import { ProductInterface, VariantInterface } from '../purchase-order/purchase-order.service';

@Injectable()
export class CartService {
  private cart: CartInterface = {};
  private cartTotal = 0;
  private totalItems = 0;
  private cartItems: Array<VariantInterface>;
  // source for observable
  private cartSource: BehaviorSubject<CartSourceInterface> = new BehaviorSubject(null);
  // observable stream
  public cart$ = this.cartSource.asObservable();

  constructor() { }

  public insert(product: ProductInterface, variantSKU: string, qty: number) {
    if (this.cart[product.id]) {
      if (this.cart[product.id].variants && this.cart[product.id].variants[variantSKU]) { // Update
        this.cart[product.id].variants[variantSKU].orderedQuantity += qty;
      } else { // Add
        if (this.cart[product.id].variants) {
          this.cart[product.id].variants[variantSKU].orderedQuantity = qty;
        }
      }
    } else { // Add
      this.cart[product.id] = product;
      if (this.cart[product.id].variants && this.cart[product.id].variants[variantSKU]) {
        this.cart[product.id].variants[variantSKU].orderedQuantity = qty;
      }
    }

    // trigger cartSource
    this.updateCartSouce();
  }

  public update(product: ProductInterface, variantSKU: string, qty: number) {
    if (this.cart[product.id]) {
      if (this.cart[product.id].variants && this.cart[product.id].variants[variantSKU]) { // Update
        this.cart[product.id].variants[variantSKU].orderedQuantity = qty;
      }
    } else { // Add
      this.cart[product.id] = product;
      if (this.cart[product.id].variants && this.cart[product.id].variants[variantSKU]) {
        this.cart[product.id].variants[variantSKU].orderedQuantity = qty;
      }
    }

    // trigger cartSource
    this.updateCartSouce();
  }

  public remove(product: ProductInterface, variantSKU: string) {
    if (!this.cart[product.id]) {
      return;
    }

    if (this.cart[product.id].variants && this.cart[product.id].variants[variantSKU]) {
      this.cart[product.id].variants[variantSKU].orderedQuantity = 0;
    }

    if (this.cart[product.id].variants) {
      let found = false;
      for (const vsku in this.cart[product.id].variants) {
        if (this.cart[product.id].variants.hasOwnProperty(vsku)) {
          if (this.cart[product.id].variants[vsku].orderedQuantity) {
            found = true;
          }
        }
      }

      if (!found) {
        delete this.cart[product.id];
      }
    }

    // trigger cartSource
    this.updateCartSouce();
  }

  public contents() {
    this.updateCartSouce();
    return this.cartItems;
  }

  private updateCartSouce() {
    // update cart
    this.updateCartData();

    const cartSouceData: CartSourceInterface =  {
      cart: this.cart,
      cartItems: this.cartItems,
      cartTotal: this.cartTotal,
      totalItems: this.totalItems
    };
    console.log('test',cartSouceData);
    this.cartSource.next(cartSouceData);
  }

  private updateCartData() {
    this.cartTotal = 0;
    this.totalItems = 0;
    this.cartItems = [];

    for (const productId in this.cart) {
      if (this.cart.hasOwnProperty(productId)) {
        const product = this.cart[productId];
        for (const variantSKU in product.variants) {
          if (product.variants.hasOwnProperty(variantSKU)) {
            const variant = product.variants[variantSKU];
            if (variant.orderedQuantity || variant.orderedQuantity == 0) {
              this.cartTotal += (variant.orderedQuantity * variant.price);
              this.cartItems.push(variant);
              this.totalItems++;
            }
          }
        }
      }
    }

  }

  public resetCartData(): Promise<boolean>
  {
    return new Promise((resolve, reject) => {
      this.cart = {};
      const cartSouceData: CartSourceInterface = {
        cart: null,
        cartItems: [],
        cartTotal: 0,
        totalItems: 0
      };
      this.cartSource.next(cartSouceData);
      console.log('Reset', cartSouceData);
      resolve(true);
    });
  }

  public getOrderedQuantity(product: ProductInterface, variantSKU: string){
    
    if (this.cart[product.id] 
         && this.cart[product.id].variants 
         && this.cart[product.id].variants[variantSKU]
        ) {
          return this.cart[product.id].variants[variantSKU].orderedQuantity;      
         }
         
    return 0;
  }
}

export interface CartInterface {
  [key: string]: ProductInterface;
}

export interface CartSourceInterface {
  cart: CartInterface;
  cartTotal: number;
  totalItems: number;
  cartItems: Array<VariantInterface>;
}




