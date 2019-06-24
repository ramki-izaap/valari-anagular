import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewContainerRef  } from '@angular/core';

@Component({
  selector: 'app-variant-list',
  templateUrl: './variant-list.component.html'
 
})
export class VariantListComponent implements OnInit {

    cartData : VariantInterface;

    @Input() color: any;
    @Input() size: any;
    @Input() product:number;
    @Input() disableinput: boolean;

    @Input() 
    set orderdata(input: VariantInterface) {   
        this.cartData = input;
    }
    @Output() addtoCart  = new EventEmitter<any>();

    variantdata:any="";
        
    constructor() {
        
    } 

    ngOnInit() {

        let variants:any = this.cartData.products[this.product].variants;
        for (let key in variants) {
            if (variants[key].size==this.size && variants[key].color==this.color)
                this.variantdata = key;
            
        }
    }
    
    addcartVal(){       
        console.log(this.cartData);
        this.addtoCart.emit();
        
    }

}

export interface VariantInterface {
    itemsCount: number;
    products: {};
    total:any;
    order_id:number;
    status:string;
    
}