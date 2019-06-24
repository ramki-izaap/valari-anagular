import { Component, OnInit, Input } from '@angular/core';
import { PurchaseOrderService, ProductInterface, OptionInterface } from '../../services/purchase-order/purchase-order.service';
import { CartService, CartInterface, CartSourceInterface} from '../../services/cart/cart.service';
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss']
})
export class ProductViewComponent implements OnInit {
  @Input() product: ProductInterface;
  @Input() poItems?: {[key: string]: any};
  @Input() onloadCartUpdate: string;
  private colorVariation: OptionInterface;
  public sizeVariation: OptionInterface;
  private availableColors: Array<string> = [];
  private variants: any = {};
  private productQuantity: number;
  private cartData: CartSourceInterface;
  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private cartService: CartService) {

  }

  ngOnInit() {
    console.log('poItems', this.poItems);
    this
      .purchaseOrderService
      .getVariants()
      .subscribe(mappedOptionsById => {
        if (mappedOptionsById && mappedOptionsById[1]) {
          this.colorVariation = mappedOptionsById[1];
        }

        if (mappedOptionsById && mappedOptionsById[2]) {
          this.sizeVariation = mappedOptionsById[2];
        }
        // console.log('sizeVariation',this.sizeVariation);
        // console.log('colorVariation', this.colorVariation.values);
        for (const c of this.colorVariation.values) {
          let count = 0;
         
          for (const s of this.sizeVariation.values) {
            if (!this.variants[c.shortCode]) {
              this.variants[c.shortCode] = {};
            }
            const key = this.product.sku + '-' + c.name + '-' + s.shortCode;
            this.variants[c.shortCode][s.shortCode] = {key: key, enabled: false, quantity: ''};
            if (this.product.variants && this.product.variants[key]) {
              this.variants[c.shortCode][s.shortCode].enabled = true;
              if (typeof this.product.variants[key].isActive === 'boolean') {
                this.variants[c.shortCode][s.shortCode].enabled = this.product.variants[key].isActive;
              }
              if (this.poItems && this.poItems[key]) {
                this.variants[c.shortCode][s.shortCode].quantity = this.poItems[key].ordered_qty;
                // console.log('check',this.variants[c.shortCode][s.shortCode].quantity);
                if (this.onloadCartUpdate === 'true') {
                  setTimeout(() => {
                    this.cartService.update(this.product, key, this.poItems[key].ordered_qty);
                  }, 1000);
                }
                
              }
              count++;
            }
          }
          
          if (count) {
            this.availableColors.push(c.shortCode);
          }
        }
        console.log('this.size', this.product, this.variants);
      });
  }

  private getColorValue(colorCode: string){
    for (const c of this.colorVariation.values) {
      if (c.shortCode === colorCode) {
        return c.name;
      } 
    }

    return colorCode;
  }

  private addToCart(event, data) {
    console.log('Add to cart', data, this.cartService.contents());
    console.log('event', event.target.value, 10);

    if (!this.product.variants[data.key]) {
      event.target.value = '';
      return;
    }

    let qty = parseInt(event.target.value, 10);
    
    // if it is sales order
    if (this.onloadCartUpdate === 'true') {
      
      if (isNaN(qty)) {
        qty = 0;
      } else {
        qty = Math.round(qty);
      }

      const key = data.key;
      let orderedQty = this.cartService.getOrderedQuantity(this.product, key) || 0;
      this.productQuantity = this.product.variants[key].productQuantity;
      console.log('productQuantity::customerQuantity', this.productQuantity +'::'+(qty+orderedQty));

      if(this.productQuantity < (qty+orderedQty)){
        alert('The entered quantity exceeds the available quantity of '+ this.productQuantity + '.');
        event.target.value = '';
        this.cartService.remove(this.product, data.key);
        return;
      }

      if (qty) {
        event.target.value = qty;
        this.cartService.update(this.product, data.key, qty);
      } else {
        event.target.value = '';
        this.cartService.remove(this.product, data.key);
      }

      
    } else {
      if (!isNaN(qty) && qty) {
        qty = Math.round(qty);
        event.target.value = qty;
        this.cartService.update(this.product, data.key, qty);
      } else {
        if (isNaN(qty)) {
          event.target.value = '';
        }
        this.cartService.update(this.product, data.key, 0);        
      }  
    }

    console.log(this.product, this.cartService.contents());
  }

}
