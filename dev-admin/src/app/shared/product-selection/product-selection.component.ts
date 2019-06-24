import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// SERVICES
import { PurchaseOrderService, CategoryInterface, ProductInterface } from './../../services/purchase-order/purchase-order.service';
import { AuthService } from './../../services/auth/auth.service';
import { CartService, CartSourceInterface} from './../../services/cart/cart.service';

@Component({
  selector: 'app-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.scss']
})
export class ProductSelectionComponent implements OnInit {
  @Output() selectedData  = new EventEmitter<any>();
  @Input() orderType?: string;
  public categories: Array<CategoryInterface> = [];
  // private vendors = [];
  constructor(private purchaseOrderService: PurchaseOrderService) { }

  ngOnInit() {
    this
      .purchaseOrderService
      .getVariants()
      .subscribe((mappedCategories) => {
        console.log(mappedCategories);
      });

    this
      .purchaseOrderService
      .getParentProductsByCategory(this.orderType)
      .subscribe((mappedCategories) => {
        console.log('BBBBB', mappedCategories);
        this.categories = mappedCategories;

      });
  }

  selectAll(category: CategoryInterface) {
    console.log(this.categories);
    for (const product of category.products) {
      product.selected = category.selected;
    }
  }

  checkIfAllSelected(category: CategoryInterface) {
    console.log(category, this.categories);
    category.selected = category.products.every(item => {
      return item.selected === true;
    });
  }

  send() {

    this.selectedData.emit(this.categories);
  }


}
