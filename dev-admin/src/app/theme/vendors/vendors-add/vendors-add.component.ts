import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// SERVICES
import { UsersService } from '../../../services/users/users.service';
import { AuthService } from '../../../services/auth/auth.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AppSettingsService, CommonModalInterface } from './../../../services/app-settings.service';

// INTERFACE
import { VendorInetrface } from './vendors-add.interface';

// Validators
import { QstAsyncValidatorWrapper } from './../../../validators/async-validator-wrapper';
import { AsyncValidators } from './../../../validators/async-validator';

import { Observable } from 'rxjs/Observable';
import { validateConfig } from '@angular/router/src/config';
@Component({
  selector: 'app-vendors-add',
  templateUrl: './vendors-add.component.html',
  styleUrls: ['./vendors-add.component.scss']
})
export class VendorsAddComponent implements OnInit {

  private vendor: VendorInetrface;
  public vendorForm: FormGroup;
  public vendorFormSubmitted:boolean = false;
  private vendorName: FormControl;
  private storeName: FormControl;
  private email: FormControl;
  private phoneNumber: FormControl;
  private priceId: FormControl;
  private address1: FormControl;
  private address2: FormControl;
  private city: FormControl;
  private state: FormControl;
  private country: FormControl;
  private zip: FormControl;
  // private retaddress1: FormControl;
  // private retaddress2: FormControl;
  // private retcity: FormControl;
  // private retstate: FormControl;
  // private retcountry: FormControl;
  // private retzip: FormControl;
  private boutiqueName:FormControl;
  private shippingRate:FormControl;
  //private returnPolicy:FormControl;
  private returnShippingRate:FormControl;
  private asyncEmailValidator;

  private countries = [];
  private statesByCountry : any;
  private states: Array<any> = [];
  private priceConfig = [];
  private fileUpload: any;

  constructor(private user: UsersService,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private modalService: NgbModal,
              private appSettingsService: AppSettingsService
            ) {
                this.asyncEmailValidator = AsyncValidators.validateStoreNOtTaken(this.user, '0');
                this.statesByCountry = {};
                this.appSettingsService.getAll().subscribe(res => {
                 const httpResponse: any = res;
                 this.countries = httpResponse.countries;
                 //this.states = httpResponse.states;
                 for (const state of httpResponse.states) {
                  if (!this.statesByCountry[state.country_code]) {
                    this.statesByCountry[state.country_code] = [];
                  }
                  this.statesByCountry[state.country_code].push(state);
                }
                this.states = this.statesByCountry['US'];
                console.log('statesByCountry',this.statesByCountry);
                });
                
                this.vendor = {
                  userId: '0',
                  boutiqueName:'',
                  vendorName: '',
                  storeName: '',
                  email: '',
                  priceId:'',
                  phoneNumber: '',
                  shippingRate: '',
                  //returnPolicy: '',
                  returnShippingRate: '',
                  address1: '',
                  address2: '',
                  city: '',
                  state: '',
                  country: 'US',
                  zip: ''
                  // retaddress1: '',
                  // retaddress2: '',
                  // retcity: '',
                  // retstate: '',
                  // retcountry: 'US',
                  // retzip: ''
                };

                this.user.listVendorsConfig().subscribe(result => {
                  console.log(result);
                 const httpResponse: any = result;
                 this.priceConfig = httpResponse.vendor_price;
                 console.log(this.priceConfig);
               });
            
              }

  ngOnInit() {

    this.route.params.subscribe(params => {
      console.log('vendorParams',params);
      if (params.id) {
        this.user.getVendor(params.id)
          .subscribe(mappedVendor => {
            console.log('mappedVendor',mappedVendor);
            this.vendor = mappedVendor;
            this.states = this.statesByCountry[this.vendor.country];
            this.asyncEmailValidator = AsyncValidators.validateStoreNOtTaken(this.user, this.vendor.userId);
            this.createFormControls();
            console.log('states',this.states);
          });
      } else {
        this.createFormControls();
      }
    });

  }


  onFileChange(event)
  {
    let filename = event.target.files.item(0);
    this.fileUpload = filename;
    console.log(filename);
  }


  submit() {
    console.log(this.vendorForm.invalid, this.vendorForm);
    this.vendorFormSubmitted = true;
    if (this.vendorForm.invalid) {
      return;
    }
    
    this.vendor = {
      userId: this.vendor.userId,
      vendorName: this.vendorForm.value.vendorName,
      boutiqueName:this.vendorForm.value.boutiqueName,
      storeName: this.vendorForm.value.storeName,
      priceId: this.vendorForm.value.priceId,
      email: this.vendorForm.value.email,
      phoneNumber: this.vendorForm.value.phoneNumber,
      address1: this.vendorForm.value.address1,
      address2: this.vendorForm.value.address2,
      city: this.vendorForm.value.city,
      state: this.vendorForm.value.state,
      country: this.vendorForm.value.country,
      zip: this.vendorForm.value.zip,
      // retaddress1: this.vendorForm.value.retaddress1,
      // retaddress2: this.vendorForm.value.retaddress2,
      // retcity: this.vendorForm.value.retcity,
      // retstate: this.vendorForm.value.retstate,
      // retcountry: this.vendorForm.value.retcountry,
      // retzip: this.vendorForm.value.retzip,
      // returnPolicy: this.vendorForm.value.returnPolicy,
      returnShippingRate: this.vendorForm.value.returnShippingRate,
      shippingRate: this.vendorForm.value.shippingRate,
    };

    if (this.vendor.userId === '0') {
      console.log('1111');
      this
        .user
        .createVendor(this.vendor, this.fileUpload)
        .subscribe((resp: any) => {
          console.log(resp);
          let modalData: CommonModalInterface = null;
          if (resp.status === 'success') {
            modalData = {
              title: 'Success',
              content: 'Vendor created successfully',
              beforeDismiss: () => {
                this.router.navigate(['/vendors/list']);
              }
            };
          } else {
            modalData = {
              title: 'Error',
              content: resp.message,
              beforeDismiss: () => {}
            };
          }
          this.appSettingsService.setCommonModalData(modalData);
        });
    } else {
      console.log('2222');
      this
        .user
        .updateVendor(this.vendor, this.fileUpload)
        .subscribe((resp: any) => {
          console.log(resp);
          let modalData: CommonModalInterface = null;
          if (resp.status === 'success') {
            modalData = {
              title: 'Success',
              content: 'Vendor updated successfully',
              beforeDismiss: () => {
                this.router.navigate(['/vendors/list']);
              }
            };
          } else {
            modalData = {
              title: 'Error',
              content: resp.message,
              beforeDismiss: () => {}
            };
          }
          this.appSettingsService.setCommonModalData(modalData);
        });
    }

  }


  countryChange(event) {
    console.log('slected..', event.target.value);
    //this.states = [];
    if (this.states[event.target.value]) {
      this.states = this.states[event.target.value];
    }
    if (this.statesByCountry[event.target.value]) {
      this.states = this.statesByCountry[event.target.value];
    } 
  }

  private createFormControls() {
    console.log('vendor', this.vendor);
    this.vendorName = new FormControl(this.vendor.vendorName, [
      Validators.required
    ]);
    this.boutiqueName = new FormControl(this.vendor.boutiqueName, [
      Validators.required
    ]);
    this.storeName = new FormControl(this.vendor.storeName, [
      Validators.required,
      Validators.pattern('^[a-zA-Z]+$')
      
    ], [ QstAsyncValidatorWrapper.debounce(this.asyncEmailValidator, 800)]);
    this.email = new FormControl(this.vendor.email, [
      Validators.required,
      Validators.email
    ]);
    this.phoneNumber = new FormControl(this.vendor.phoneNumber, [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]);

    this.address1 = new FormControl(this.vendor.address1);
    this.address2 = new FormControl(this.vendor.address2);
    this.city = new FormControl(this.vendor.city);
    this.state = new FormControl(this.vendor.state);
    this.priceId = new FormControl(this.vendor.priceId);
    this.country = new FormControl(this.vendor.country);
    this.zip = new FormControl(this.vendor.zip);

    // this.retaddress1 = new FormControl(this.vendor.retaddress1);
    // this.retaddress2 = new FormControl(this.vendor.retaddress2);
    // this.retcity = new FormControl(this.vendor.retcity);
    // this.retstate = new FormControl(this.vendor.retstate);
    // this.retcountry = new FormControl(this.vendor.retcountry);
    // this.retzip = new FormControl(this.vendor.retzip);

    this.shippingRate = new FormControl(this.vendor.shippingRate, [
      Validators.required
    ]);
    this.priceId = new FormControl(this.vendor.priceId, [
      Validators.required
    ]);
    this.returnShippingRate = new FormControl(this.vendor.returnShippingRate);

    this.vendorForm = new FormGroup({
      vendorName: this.vendorName,
      boutiqueName:this.boutiqueName,
      storeName: this.storeName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      shippingRate: this.shippingRate,
      //returnPolicy: this.returnPolicy,
      returnShippingRate: this.returnShippingRate,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
        // retaddress1: this.retaddress1,
        // retaddress2: this.retaddress2,
        // retcity: this.retcity,
        // retstate: this.retstate,
        // retcountry: this.retcountry,
        // retzip: this.retzip,
      priceId: this.priceId
    });

  }

}
