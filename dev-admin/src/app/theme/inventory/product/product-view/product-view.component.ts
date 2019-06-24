import { Component, OnInit,ViewChild } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { AppSettingsService, CommonModalInterface } from './../../../../services/app-settings.service';
// INTERFACE
import { ProductUpdate } from './product-view.interface';

import { InventoryService } from '../../../../services/inventory/inventory.service';


@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
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
export class ProductViewComponent implements OnInit {
  variantsFormSubmit : boolean = false;
  showLoading: boolean = false;
  selectedFiles:any;
  alertMsg: string = '';
  rows = [];
  vendors:any;
  productEditForm: FormGroup;
  addVariantForm: FormGroup;
  productID: 0;
  categories: any;
  selectedCategories = [];
  productInfo: any;
  selectedVariants  = [];
  variantColorArr   = [];
  variantSizeArr    = [];
  variantsLists:any = [];
  variants = [];
  colors = [];
  public _productAssignedCategory = [];
  sizes  = [];
  variation: string ='';
  fileName: string ='';
  type : any;
  //public productEditFormSubmitted : boolean = false;
  private product: ProductUpdate = {
                                          id:0,
                                          name:'',
                                          sku: '',
                                          description: '',
                                          quantity: 0,
                                          category:0,
                                        // color:'',
                                          price:0,
                                          isActive:0,
                                          madeInusa: '',
                                          wrinkleFreeknit: '',
                                          regularFit: '',
                                          slimFit: '',
                                          looseFit: '',
                                          userId:0,
                                          productType:'C',
                                          materialContent:'',
                                          careInstructions:''
};

public productVariants: any = [];
public editing = {};
public productImages: any;
@ViewChild('myFile') myFileVariable:any;
  constructor(
    public inventory: InventoryService,
    public route: ActivatedRoute,
    public router: Router,
    public modalService: NgbModal,
    private appSettingsService: AppSettingsService 
  ) 
  {

    const name          = new FormControl(this.product.name, [Validators.required]);
    const product_type  = new FormControl(this.product.productType, [Validators.required]);
    const sku           = new FormControl(this.product.sku, [Validators.required,Validators.minLength(50)]);
    const description   = new FormControl(this.product.description, [Validators.required]);
    const quantity      = new FormControl(this.product.quantity, [Validators.required]);
    const category      = new FormControl(this.product.category, [Validators.required]);
    //const color         = new FormControl(this.product.color, [Validators.required]);
    const price         = new FormControl(this.product.price, [Validators.required]);
    const isActive      = new FormControl(this.product.isActive, [Validators.required]);
    const wrinkleFreeknit = new FormControl(this.product.wrinkleFreeknit);
    const madeInusa       = new FormControl(this.product.madeInusa); 
    const regularFit      = new FormControl(this.product.regularFit);
    const slimFit         = new FormControl(this.product.slimFit);
    const looseFit        = new FormControl(this.product.looseFit);
    const materialContent   = new FormControl(this.product.materialContent);
    const careInstructions   = new FormControl(this.product.careInstructions);

    this.productEditForm  = new FormGroup({
            name: name,
            product_type: product_type,
            sku: sku,
            description: description,
            quantity: quantity,
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

  this.loadVariantForm();
    
    this.getVariants();

  }

  ngOnInit() {

    this.route.params.subscribe(params => {

      console.log('params', params);
        
      if(params.id){
        
          this.productID = params.id;
  
          this.getCategories(this.productID);
          this.getVendorsByProduct(this.productID);
          this.getImages();
  
          this.inventory.getProductDetailsById(this.productID,'product').subscribe( (resp : any) => {
            console.log('Product Edit', resp.product_info);
            this.productInfo = resp.product_info;
           if(this.productInfo.type == 'C'){
             this.type = 'configurable';
           }
            this.productEditForm  = new FormGroup({
              name: new FormControl(this.productInfo.name),
              product_type: new FormControl(this.type),
              sku: new FormControl(this.productInfo.sku),
              description: new FormControl(this.productInfo.description),
              quantity: new FormControl(this.productInfo.quantity),
              price: new FormControl(this.productInfo.price), 
              isActive: new FormControl(this.productInfo.is_active),
              wrinkleFreeknit: new FormControl(this.productInfo.wrinkle_free_knit),
              madeInusa: new FormControl(this.productInfo.made_in_usa),
              regularFit: new FormControl(this.productInfo.regular_fit),
              slimFit: new FormControl(this.productInfo.slim_fit),
              looseFit: new FormControl(this.productInfo.loose_fit),
              materialContent: new FormControl(this.productInfo.material_content),
              careInstructions: new FormControl(this.productInfo.care_instructions)
              
            });
  
          });

         }

        this.getProductVariants();
        this.getProductColors();
       
      });

  }

    loadVariantForm(){

      const color = new FormControl("", [Validators.required]);
    const size  = new FormControl("", [Validators.required]);
    const qty  = new FormControl("", [Validators.required]);
    
    
    this.addVariantForm  = new FormGroup({
      color: color,
      size: size,
      quantity:qty
    });

  }

  getProductVariants(){
    this.inventory.getVariantsByProductID(this.productID).subscribe(  (resp: any) => {
      this.productVariants = resp;
      this.rows            = resp;
      console.log('Rows',resp);
    });
  }

  getProductColors(){
    this.inventory.getColorsByProductID(this.productID).subscribe(  (resp: any) => {
      console.log('Colors',resp);
      this.colors = resp;
    });
  }

  getCategories(productID){
    console.log(productID);
    
    this.inventory.getCategories(productID).subscribe( resp => {
      this.categories = resp;
      console.log('Selected Categories',this.categories);
    });
  }

  getVendorsByProduct(productID){
    console.log(productID);
    
    this.inventory.getVendorsByProduct(productID).subscribe( resp => {
      this.vendors = resp;
      console.log('Selected Vendors',this.vendors);
    });

  }

  getVariants(){

    this.inventory.getVariants().subscribe( resp => {
      this.variantsLists = resp;
      this.variants = Object.keys(this.variantsLists);
      });

    }
  
   


  updateCategory(){
    
    this.selectedCategories = [];
    for(let category of this.categories){
      if(category.selected){
        this.selectedCategories.push(category);
      }
    }

    console.log(this.selectedCategories);

     this.inventory.updateCategoies(this.productID,this.selectedCategories).subscribe( (resp:any) => {
      let modalData: CommonModalInterface = null;
          if (resp.status === 'success') {
            modalData = {
              title: 'Success',
              content: 'Updated Successfully',
              beforeDismiss: () => {}
            };
            this.categories = [];
          } else {
            modalData = {
              title: 'Error',
              content: resp.message,
              beforeDismiss: () => {}
            };
          }
          this.appSettingsService.setCommonModalData(modalData);
      
      
      this.getCategories(this.productID);
    });

  }

  productCreation() {
    
    console.log(this.productID);
   // this.productEditFormSubmitted = true;
    // if(this.productEditForm.invalid){
    //      return false;
    // }
       this.product = {
           id: this.productID,
           name:  this.productEditForm.value.name,
           sku: this.productEditForm.value.sku,
           description: this.productEditForm.value.description,
           quantity: this.productEditForm.value.quantity,
           category:this.productEditForm.value.category,
         //  color:this.productForm.value.color,
           price:this.productEditForm.value.price,
           isActive:this.productEditForm.value.isActive,
           productType: this.productEditForm.value.product_type,
           wrinkleFreeknit: this.productEditForm.value.wrinkleFreeknit,
           madeInusa: this.productEditForm.value.madeInusa,
           regularFit: this.productEditForm.value.regularFit,
           slimFit: this.productEditForm.value.slimFit,
           looseFit: this.productEditForm.value.looseFit,
           userId:0,
           materialContent:this.productEditForm.value.materialContent,
           careInstructions:this.productEditForm.value.careInstructions
       };

   this.inventory.product(this.product,this.selectedVariants,this.variantColorArr,this.variantSizeArr)
   .subscribe( resp => {
     console.log(resp);
     const httpResponse: any = resp;

     let modalData: CommonModalInterface = null;
          if (resp.status === 'success') {
            modalData = {
              title: 'Success',
              content: httpResponse.message,
              beforeDismiss: () => {}
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

openModal(content) {
   
  this.modalService.open(content).result.then((result) => {
  //  console.log(result);
  // this.closeResult = `Closed with: ${result}`;
  // console.log(this.closeResult);
  }, (reason) => {
   ///this.closeResult = `Dismissed ${reason}`;
  // console.log(this.closeResult);
  });
}

addVariant(){
   this.variantsFormSubmit = true;
  if(this.addVariantForm.invalid){
       return false;
  }

  console.log(this.addVariantForm.value.color);
  console.log(this.addVariantForm.value.size);

  if(this.addVariantForm.valid){
    
      let color = this.variantsLists.color[this.addVariantForm.value.color];
      let size  = this.variantsLists.size[this.addVariantForm.value.size];
      let qty  = this.addVariantForm.value.quantity;
      let productName = this.productEditForm.value.name;
      this.inventory.addVariantValueToProduct(color,size,qty,this.productID,productName)
      .subscribe( (resp:any) => {
        alert(resp.message);
        this.getProductVariants();
        document.getElementById('modalCloseBtn').click();
        this.loadVariantForm();
      });

   } 

}

updateProductVariantsValue(event, column, rowIndex){

  const productVariantsData = this.productVariants[rowIndex];
  this.editing[rowIndex + '-' + column] = false;

  //this.rows[column][rowIndex] = event.target.value;

  let updateValue = event.target.value;

   this.inventory.updateProductVariantsValue(productVariantsData,event.target.value,column)
   .subscribe( (resp:any) => {
     alert(resp.message);
     this.getProductVariants();
   });
}
  showBreabCrumb(category,product)
  {
    ​var nameIntro = "Home/";
	    // this inner function has access to the outer function's variables, including the parameter​
	  ​function makeFullName () {      
	    ​return nameIntro + category + product;
    }	​
    return makeFullName();
  }

  onFileChange(event)
  {
    this.selectedFiles = event.target.files.item(0);
    console.log('Change Event',this.selectedFiles);
  }
  
  doUpload() {

    if(this.variation=='' || this.fileName=='')
    {
      alert("Please choose color and image");
      return;
    }
    this.showLoading = true;
    console.log('Variation',this.selectedFiles);
    this.inventory.BulkUpload(this.selectedFiles,this.productID,this.variation).subscribe((res)=>{
      console.log('Res',res);
      this.getImages();
      this.showLoading = false;
      this.alertMsg = 'Uploaded Successfully';
      this.myFileVariable.nativeElement.value = this.variation = '';
      setTimeout(()=>{
        this.alertMsg = '';
      },3000);
    });
    
  }


  getImages(){
    this.inventory.getProductImages(this.productID).subscribe((res)=>{
       this.productImages = res;
       console.log('imagessss',this.productImages);
    });
  }

  deleteImg(id:number=null,pid:number=null,name:string =''){
    this.showLoading = true;
    let data = {uri:pid+'/'+name,rowid:id};
    console.log('URI',data);
    this.inventory.delImage(data).subscribe((res)=>{
        console.log('Delete',res);
        this.showLoading = false;
        this.alertMsg = 'Deleted Successfully';
        this.getImages();
        setTimeout(()=>{
          this.alertMsg = '';
        },3000);
    });
  }

  
  setFavVariant(value:string){
    this.showLoading = true;
    console.log('Fav Variant',value);
    let data: any = {sku:value};
    this.inventory.SetFav(data).subscribe((res)=>{
      console.log('Fav',res);
      this.showLoading = false;
      this.alertMsg = 'Favorite Variant set Successfully';
      this.getProductVariants();
      setTimeout(()=>{
        this.alertMsg = '';
      },3000);
  });
  }

}
