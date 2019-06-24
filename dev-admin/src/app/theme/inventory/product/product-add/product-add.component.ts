import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { AppSettingsService, CommonModalInterface } from './../../../../services/app-settings.service';

// INTERFACE
import { ProductCreation } from './product-add.interface';

import { InventoryService } from '../../../../services/inventory/inventory.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class ProductAddComponent implements OnInit {
  public productFormSubmitted:boolean = false;
  productForm: FormGroup;
  variantsAttributeForm: FormGroup;
  isVariantsView: any = true;
  variantsDetailPageButtonChange = true;
  selectedVariants  = [];
  variantColorArr   = [];
  variantSizeArr    = [];
  variants_quantity = [];
  productCreateButton = false;
  isModalShow = true;
  categories: any;
  selectedCategories = [];
  productType: string;
  public variantPopupRef: any;

 private product: ProductCreation = {
                                      id: 0,
                                      name: '',
                                      sku: '',
                                      description: '',
                                      quantity:'',
                                      category: 0,
                                     // color:'',
                                      price:'',
                                      isActive: 0,
                                      userId: 0,
                                      productType: 'configurable',
                                      madeInusa: '',
                                      wrinkleFreeknit: '',
                                      regularFit: '',
                                      slimFit: '',
                                      looseFit: '',
                                      materialContent:'',
                                      careInstructions:''

 };

 variantsLists: any = [];
 variants = [];
 closeResult: any;
 productID: 0;
 public productInfo: any;
 public variantsButtonEnable = false;


  constructor(  public inventory: InventoryService,
                public modalService: NgbModal,
                public route: ActivatedRoute,
                public router: Router,
                private appSettingsService: AppSettingsService
  ) {


  
      this.defaultProductDescription();
      const name          = new FormControl(this.product.name, [Validators.required,]);
      const product_type  = new FormControl(this.product.productType, [Validators.required]);
      const sku           = new FormControl(this.product.sku, [Validators.required]);
      const description   = new FormControl(this.product.description, [Validators.required]);
      //const quantity      = new FormControl(this.product.quantity, [Validators.required]);
      const quantity  = new FormControl(this.product.quantity, [
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ]);

      const category      = new FormControl('', [Validators.required]);


      // const color         = new FormControl(this.product.color, [Validators.required]);
      //const price         = new FormControl(this.product.price, [Validators.required]);
      const price  = new FormControl(this.product.price, [
        Validators.required,Validators.pattern('[0-9]+(\.[0-9]{1,2})?$'),CustomValidators.number
      ]);


      const isActive        = new FormControl('', [Validators.required]);
      const wrinkleFreeknit = new FormControl(this.product.wrinkleFreeknit);
      const madeInusa       = new FormControl(this.product.madeInusa); 
      const regularFit      = new FormControl(this.product.regularFit);
      const slimFit         = new FormControl(this.product.slimFit);
      const looseFit        = new FormControl(this.product.looseFit);
      const materialContent   = new FormControl(this.product.materialContent);
      const careInstructions   = new FormControl(this.product.careInstructions);

      this.productForm    = new FormGroup({
        name: name,
        product_type: product_type,
        sku: sku,
        description: description,
        quantity: quantity,
        category: category,
        price: price,
        isActive: isActive,
        wrinkleFreeknit: wrinkleFreeknit,
        madeInusa: madeInusa,
        regularFit: regularFit,
        slimFit: slimFit,
        looseFit: looseFit,
        materialContent: materialContent,
        careInstructions: careInstructions
        });

      this.getCategories(this.productID);

   // this.productType = this.productForm.value.product_type;

      this.inventory.getVariants().subscribe( resp => {
        this.variantsLists = resp;
        this.variants = Object.keys(this.variantsLists);
        console.log(this.variantsLists);

        });

      }


    defaultProductDescription()
    {
      this.product.description = "";
      
    }

  ngOnInit() {

    
  /*<hr>
  <div class="video-description">
    <div><span style="color: #000000;"><b>Angle Hem Tunic</b></span></div>
    <div><span style="color: #000000;">Designed to fit comfortably around the bust and gradually flare out towards the midsection providing ample room to breathe with an asymmetrical hemline.</span></div>
    <div>
      <table width="100%">
        <tbody>
          <tr>
            <td><span style="color: #000000;">&nbsp;</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div><span style="color: #000000;"><strong>Scoop Neckline</strong></span></div>
    <div><span style="color: #000000;">Medium low in front, rounded and wider than base of the neck.</span></div>
    <table width="100%">
      <tbody>
      <tr>
      <td><span style="color: #000000;">&nbsp;</span></td>
      </tr>
      </tbody>
    </table>
    <span style="color: #000000;"> <strong>Color</strong>&nbsp;<strong>&amp; Fabric</strong></span>
  </div>';*/

  }

  getCategories(productID) {

    this.inventory.getCategoriesNew(productID).subscribe( resp => {
      this.categories = resp;
      console.log(this.categories);
    });
  }


  variantsArrayLists() {

    console.log(this.productForm.value.name);

    this.isVariantsView  = false;

    for (const variant of this.variants ) {

      for (const variantData of this.variantsLists[variant]) {

      if (variantData.selected) {

        // this.selectedVariants.push(variantData);
        if (variantData.type === 'size') {
          this.variantSizeArr.push(variantData);
        }

        if (variantData.type === 'color') {
          this.variantColorArr.push(variantData);
        }

      }

    }

   }

    for (const sizeArr of this.variantSizeArr) {

        for (const colorArr of this.variantColorArr) {

            let variants_ids = '';
                variants_ids = colorArr.variant_value_id + ',' + sizeArr.variant_value_id;

            const resultArr = {
                 variant_value_ids: variants_ids,
                 product_name: this.productForm.value.name,
                 color: colorArr.name,
                 size: sizeArr.name,
                 quantity: this.productForm.value.quantity,
                 color_short_code: colorArr.short_code,
                 size_short_code: sizeArr.short_code,
                 //short_code: this.productForm.value.sku + '-' + colorArr.short_code + '-' + sizeArr.short_code,
                 short_code: this.productForm.value.sku + '-' + colorArr.name + '-' + sizeArr.short_code,
                 price: this.productForm.value.price
           };

           this.selectedVariants.push(resultArr);
        }
    }

    if(!this.selectedVariants || this.selectedVariants.length === 0){
      alert('Please select atleast a color and size.');
      this.isVariantsView  = true;
      this.variantColorArr = [];
      this.variantSizeArr = [];
      return;
    }
    
    this.variantsDetailPageButtonChange = false;

    console.log(this.selectedVariants);

  }

  saveVariants(event) {
    console.log('product creation');
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
   // this.ngb.close();
    this.productCreateButton = true;
   //  this.modalService.dismiss();
    this.productCreation();
  }

  openModal(content) {

    this.productFormSubmitted = true;
    if(this.productForm.invalid){
         return false;
    }

    this.variantPopupRef = this.modalService.open(content);
    this.variantPopupRef.result.then((result) => {
    //  console.log(result);
     this.closeResult = `Closed with: ${result}`;
     console.log(this.closeResult);
    }, (reason) => {
     this.closeResult = `Dismissed ${reason}`;
     console.log(this.closeResult);
    });
  }

  productCreation() {
    this.productFormSubmitted = true;
    
    if(this.productForm.valid && this.variantSizeArr.length == 0 && this.variantColorArr.length == 0) {
      alert('Please Select Variants');
      return false;
    }
    else if(this.productForm.valid)
    {
      console.log(this.selectedVariants);
      this.isModalShow = false;
      console.log(this.productID);
      this.product = {
                       id: 0,
                       name:  this.productForm.value.name,
                       sku: this.productForm.value.sku,
                       description: this.productForm.value.description,
                       quantity: this.productForm.value.quantity,
                       category: this.productForm.value.category,
                     //  color:this.productForm.value.color,
                       price: this.productForm.value.price,
                       isActive: this.productForm.value.isActive,
                       productType: this.productForm.value.product_type,
                       wrinkleFreeknit: this.productForm.value.wrinkleFreeknit,
                       madeInusa: this.productForm.value.madeInusa,
                       regularFit: this.productForm.value.regularFit,
                       slimFit: this.productForm.value.slimFit,
                       looseFit: this.productForm.value.looseFit,
                       userId: 0,
                       materialContent:this.productForm.value.materialContent,
                       careInstructions:this.productForm.value.careInstructions
       };
     this.inventory.product(this.product, this.selectedVariants, this.variantColorArr, this.variantSizeArr)
       .subscribe( resp => {
        console.log(resp);
        const httpResponse: any = resp;
        if (this.variantPopupRef) {
          this.variantPopupRef.close();
        }
        let modalData: CommonModalInterface = null;
          if (resp.status === 'success') {
            modalData = {
              title: 'Success',
              content: httpResponse.message,
              beforeDismiss: () => {
                this.router.navigate(['/product/list']);
              }
            };
          } else {
            modalData = {
              title: 'Error',
              content: httpResponse.message,
              beforeDismiss: () => {}
            };
          }
          this.appSettingsService.setCommonModalData(modalData);
      });
    }

}

// variantsButtonDisable(event) {

//   if (event.target.value === 'simple') {
//     this.variantsButtonEnable = false;
//     this.productCreateButton = true;
//   } else {
//     this.variantsButtonEnable = true;
//     this.productCreateButton = false;
//   }

// }

addToCategory(category) {
 this.selectedCategories.push(category);
 console.log(this.selectedCategories);
}

removeFromCategory(index) {
 this.selectedCategories.splice(index);
 console.log(this.selectedCategories);
}

categoryAutoComplete = (searchKey) => {
 console.log(searchKey);
 return this.inventory.getCategoriesByKey(searchKey);
}

}
