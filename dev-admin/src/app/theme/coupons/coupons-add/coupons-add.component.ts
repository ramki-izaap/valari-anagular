import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { CouponsService } from '../../../services/coupons/coupons.service';
import { AuthService } from '../../../services/auth/auth.service';

// INTERFACE
import { CouponsCreation } from './coupons-add.interface';
import { AppSettingsService, CommonModalInterface} from '../../../services/app-settings.service';
import { AnonymousSubscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-coupons-add',
  templateUrl: './coupons-add.component.html',
  styleUrls: ['./coupons-add.component.scss']
})
export class CouponsAddComponent implements OnInit {
  public div1:boolean = true;
  public div2:boolean = false;
  public div3:boolean = false;
  public div4:boolean = false;
  public errors=[];
  public up_error:string = "";
  public configURL:string;
  public couponFormSubmitted:boolean = false;
myForm : FormGroup;
couponsform : any;
public userInfo : any;
dp_total:boolean = true;
dp_shipping:boolean = false;
dp_specific:boolean = false;
public countries : any;
public states = [];
public today = new Date();
public fileToUpload = [];
public csv_file_url:string = "";
public couponsInfo : any;
public actionType : any = 'create';
public editId : any;
public paramId : any;
public autoSearch = ['coupons','test'];
public Coupons = [];
private couponsForm : CouponsCreation = { id: 0,discount_details:'',title:'',discount_used:'0',discount_used_one_user:'',
                                          amount_percentage:'',amount_type:'',off_for:'total',product:'',amount:'',
                                          shipping_methods:'',trigger_quantity:'',apply_quantity:'',apply_products_count:'',
                                          coupon_documents:'',countries:'',state:'',discount_begins:'',discount_expires:'',csv_file:''};
  constructor(private coupons: CouponsService, private route: ActivatedRoute,
    private router: Router,private authService: AuthService,private apiURL:AppSettingsService) { 
      this.configURL = this.apiURL.getApiUrl()+'/docs/coupon-import.csv';
      this.userInfo = this.authService.getUserInfo();
      //console.log(this.userInfo.id); 

     
      // const discount_details = new FormControl(this.couponsForm.discount_details, [
      //   Validators.required,
      //   Validators.pattern('^[A-Z0-9]+$')
        
      // ]);
      const discount_details = new FormControl(this.couponsForm.discount_details,[Validators.required]);
      const title = new FormControl(this.couponsForm.title,[Validators.required]);
      const discount_used = new FormControl(this.couponsForm.discount_used);
      const discount_used_one_user = new FormControl(this.couponsForm.discount_used_one_user);

      const amount_percentage = new FormControl(this.couponsForm.amount_percentage, [
        Validators.required,
        Validators.pattern('^[0-9]+$')]);
      
      const amount_type = new FormControl(this.couponsForm.amount_type);
      const off_for = new FormControl(this.couponsForm.off_for);
      const product = new FormControl(this.couponsForm.product);
    
      const amount = new FormControl(this.couponsForm.amount, [
      Validators.required,
      Validators.pattern('^[0-9]+$')]);

      const shipping_methods = new FormControl(this.couponsForm.shipping_methods);
      const trigger_quantity = new FormControl(this.couponsForm.trigger_quantity);
      const apply_quantity = new FormControl(this.couponsForm.apply_quantity);
      const apply_products_count = new FormControl(this.couponsForm.apply_products_count);
      const coupon_documents = new FormControl(this.couponsForm.coupon_documents);
      const countries = new FormControl(this.couponsForm.countries);
     // const state = new FormControl(this.couponsForm.state,[Validators.required]);
      const discount_begins = new FormControl(this.couponsForm.discount_begins,[Validators.required]);
      const discount_expires = new FormControl(this.couponsForm.discount_expires,[Validators.required]);
  
      this.myForm =new FormGroup ({   
                      discount_details : discount_details,
                      title :  title,
                      discount_used : discount_used,
                      discount_used_one_user: discount_used_one_user,
                      amount_percentage : amount_percentage,
                      amount_type : amount_type, 
                      off_for : off_for,
                      product : product,
                      amount : amount,
                      shipping_methods : shipping_methods,
                      trigger_quantity : trigger_quantity,
                      apply_quantity : apply_quantity,
                      apply_products_count : apply_products_count,
                      coupon_documents :coupon_documents,
                     // countries : countries,
                     // state : state,
                      discount_begins : discount_begins,
                      discount_expires : discount_expires
      });
  
      this.coupons.listcountries().subscribe(result => {
           console.log(result);
          const httpResponse: any = result;
          this.countries = httpResponse.countries;
      });
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('params', params);
          this.paramId = params.id;
            if (params.id && params.id !== 'undefined') {
                  this.coupons.getCoupons(params.id)
                  .subscribe((res: any) => {
                  console.log('cOUPONS',res.edit_coupons);
                  this.couponsInfo = res.edit_coupons;
                  this.actionType = 'update';

                  this.myForm = new FormGroup({
                    discount_details: new FormControl(this.couponsInfo.code),
                    title: new FormControl(this.couponsInfo.title),
                    discount_used: new FormControl(this.couponsInfo.total_usage_limit),
                    discount_used_one_user: new FormControl(this.couponsInfo.user_usage_limit),
                    amount_percentage: new FormControl(this.couponsInfo.benefit_amt),
                    amount_type: new FormControl(this.couponsInfo.discount_type),
                    off_for: new FormControl(this.couponsInfo.type),
                    //product: new FormControl(this.couponsInfo.benefit_amt),
                    amount: new FormControl(this.couponsInfo.trigger_amt),
                   // shipping_methods: new FormControl(this.couponsInfo.trigger_amt),
                   //trigger_quantity: new FormControl(this.couponsInfo.benefit_amt),
                   //apply_quantity: new FormControl(this.couponsInfo.benefit_amt),
                   //apply_products_count: new FormControl(this.couponsInfo.benefit_amt),
                   //coupon_documents: new FormControl(this.couponsInfo.type),
                   //countries: new FormControl(this.couponsInfo.valid_countries),
                   //state: new FormControl(this.couponsInfo.type),
                   discount_begins: new FormControl(this.couponsInfo.c_start_date),
                   discount_expires: new FormControl(this.couponsInfo.e_start_date)
                  }
                );

              });
          }
    });
    this.getStates();
  }

  onFileChange(event)
  {
    document.querySelector('#effect-1').classList.add('md-show');
    let filename = event.target.files.item(0);
    this.fileToUpload  = filename;
    this.coupons.UploadCSV(this.fileToUpload).subscribe(data=>{
      console.log(data);
      
        this.div1 = false;
        if(data['res_status'] == 'error')
        {
          this.div3 = true;this.div2 = false;
          this.up_error = data['msg'];
        }
        else
        {
          let upload_response = data['response'];
          if(upload_response.status === 'error')
          {
            this.div2 = true;
            this.errors = upload_response.errors;
          }
          else if(upload_response.status === 'success')
          {
            this.div2 = false; this.div3 = false;
            this.div4 = true;
            this.csv_file_url = data['file_path'];
          }
        }
    },error=>{
      console.log(error);
    });
  }
  closeModal()
  {
    document.querySelector('#effect-1').classList.remove('md-show');
  }
  addToCoupons(coupons) {
    this.Coupons.push(coupons);
    //console.log(this.Coupons.push(coupons));
  }

  removeFromCoupons(id)
  {
    this.Coupons.splice(id,1);
   // console.log(this.Coupons.splice(id,1));
  }

  getCouponsValue(key)
  {
    console.log(key);
  }
   
  off_for()
  {

    //  if(this.myForm.value.off_for == "total")
    //  {
    //    this.dp_total = true;
    //    this.dp_shipping = false;
    //    this.dp_specific = false;
    //  }

    //  if(this.myForm.value.off_for == "shipping")
    //  {
      
    //    this.dp_total = true;
    //    this.dp_shipping = true;
    //    this.dp_specific = false;
    //  }

    //  if(this.myForm.value.off_for == "products")
    //  {
      
    //     this.dp_total = false;
    //     this.dp_shipping = false;
    //     this.dp_specific = true;
    //  }
  }

  getStates()
  {
      //alert(this.countries);
      this.coupons.liststates().subscribe(result => {
       
       const httpResponse: any = result;
       this.states = httpResponse.states;
        console.log('States',this.states);
    });
  }

  CouponsCreation()
  {

    this.couponFormSubmitted = true;
    if (this.myForm.invalid) {
      return;
    }

     if(this.paramId){ this.editId = this.paramId}
    // console.log(this.editId);
      this.couponsform = { id : this.editId,
                           discount_details : this.myForm.value.discount_details,
                           title:this.myForm.value.title,
                           discount_used:this.myForm.value.discount_used,
                           discount_used_one_user: this.myForm.value.discount_used_one_user,
                           amount_percentage:this.myForm.value.amount_percentage,
                           amount_type:this.myForm.value.amount_type,
                           off_for:this.myForm.value.off_for,
                           product:this.myForm.value.product,
                           amount:this.myForm.value.amount,
                           shipping_methods:this.myForm.value.shipping_methods,
                           trigger_quantity:this.myForm.value.trigger_quantity,
                           apply_quantity:this.myForm.value.apply_quantity,
                           apply_products_count:this.myForm.value.apply_products_count,
                           coupon_documents: this.myForm.value.coupon_documents,
                           //countries:this.myForm.value.countries,
                           //state:this.myForm.value.state,
                           discount_begins:this.myForm.value.discount_begins,
                           discount_expires:this.myForm.value.discount_expires,
                           user_id : this.userInfo.id,
                          csv_file:this.csv_file_url };
        console.log(this.couponsform);  
            this.coupons.coupon_details(this.couponsform, this.actionType).subscribe( resp => {
              console.log(resp);
              const httpResponse: any = resp;
              let modalData: CommonModalInterface = null;
              if (resp.status === 'success') {
                modalData = {
                  title: 'Success',
                  content: httpResponse.message,
                  beforeDismiss: () => {
                    this.router.navigate(['/coupons/list']);
                  }
                };
              } else {
                modalData = {
                  title: 'Error',
                  content: httpResponse.message,
                  beforeDismiss: () => {}
                };
              }
              this.apiURL.setCommonModalData(modalData);
              });                
  }

}
