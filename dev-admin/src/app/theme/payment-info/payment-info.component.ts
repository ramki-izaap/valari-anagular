import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

// SERVICE
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { PaymentInterface , AuthorizeInterface} from './payment-interface';


// Interface
import { AppSettingsService, CommonModalInterface } from '../../services/app-settings.service';
@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],

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
export class PaymentInfoComponent implements OnInit {


  public userInfo: any;
  paypalForm: FormGroup;
  isdatavailable = true;
  public paypalFormSubmitted = false;
  public authorizeFormSubmitted = false;
  authorizeForm: FormGroup;
  public paypalInfo: PaymentInterface;
  public authorizeInfo: AuthorizeInterface;
  // public mode = [];
  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private user: UsersService,
              private appSettingsService: AppSettingsService
  ) {

   }

  ngOnInit() {
    this.paypalInfo = {email: '', clientid: '', username: '', password: '', signature: '', type: 'Paypal'};
    this.authorizeInfo = {api_login_id: '', api_transaction_key: '', type: 'Authorize'};
    this.userInfo = this.auth.getUserInfo();
    console.log('User Info', this.userInfo);
    this.loadPaymentInfo();

  }

  loadPaymentInfo() {
    this.user.getPaymentInfo(this.userInfo.id).subscribe((res) => {
      console.log('Payment Info', res.paypal);
      if (res.status === 'success') {

       if (res.paypal.api_credentials) {
        this.loadPaypal(res.paypal);
       }
       if (res.authorize.api_credentials) {
        this.loadAuthorize(res.authorize);
       }
       this.loadForm();
      } else {
        this.loadForm();
      }

    });
  }

    savePaypal() {
      this.paypalFormSubmitted = true;
      if (this.paypalForm.valid) {
        this.user.SavePaypal(this.paypalForm.value).subscribe((res) => {
          console.log(res);
          let modalData: CommonModalInterface = null;
          if (res.status === 'success') {
            modalData = {
              title: 'Success',
              content: res.message,
              beforeDismiss: () => {}
            };
          } else {
            modalData = {
              title: 'Error',
              content: res.message,
              beforeDismiss: () => {}
            };
          }
          this.appSettingsService.setCommonModalData(modalData);
        });
      }
    }
    saveAuthorize() {
      this.authorizeFormSubmitted = true;
      if (this.authorizeForm.valid) {
        this.user.SaveAuthorize(this.authorizeForm.value).subscribe((res) => {
          console.log(res);

          let modalData: CommonModalInterface = null;
          if (res.status === 'success') {
            modalData = {
              title: 'Success',
              content: res.message,
              beforeDismiss: () => {}
            };
          } else {
            modalData = {
              title: 'Error',
              content: res.message,
              beforeDismiss: () => {}
            };
          }
          this.appSettingsService.setCommonModalData(modalData);

        });
      }
    }

    loadPaypal(paypal) {

      const jsonValue: any = JSON.parse(paypal.api_credentials);
      console.log('paypal_credentials', jsonValue);
      this.paypalInfo = {
          email: jsonValue.p_email,
          clientid: jsonValue.clientid,
          username: jsonValue.username,
          password: jsonValue.password,
          signature: jsonValue.signature,
          // mode:paypal.payment_mode,
          type: 'Paypal'};
          console.log('Loaded paypal', this.paypalInfo);
    }

    loadAuthorize(authorize) {
      const jsonValue: any = JSON.parse(authorize.api_credentials);
      console.log('authorize_credentials', jsonValue);
      this.authorizeInfo = {
          api_login_id: jsonValue.api_login_id,
          api_transaction_key: jsonValue.api_transaction_key,
          // mode:authorize.payment_mode,
          type: 'Authorize'};
          console.log('Loaded amazon', this.authorizeInfo);
    }

    loadForm() {
      this.paypalForm = new FormGroup({
        vendorID: new FormControl(this.userInfo.id),
        email: new FormControl(this.paypalInfo.email, [Validators.required]),
        clientid: new FormControl(this.paypalInfo.clientid, [Validators.required]),
        username: new FormControl(this.paypalInfo.username, [Validators.required]),
        password: new FormControl(this.paypalInfo.password, [Validators.required]),
        signature: new FormControl(this.paypalInfo.signature, [Validators.required]),
        // mode: new FormControl(this.paypalInfo.mode,[Validators.required]),
        type: new FormControl(this.paypalInfo.type)
      });

      this.authorizeForm = new FormGroup({
        vendorID: new FormControl(this.userInfo.id),
        api_login_id: new FormControl(this.authorizeInfo.api_login_id, [Validators.required]),
        api_transaction_key: new FormControl(this.authorizeInfo.api_transaction_key, [Validators.required]),
        // mode: new FormControl(this.authorizeInfo.mode,[Validators.required]),
        type: new FormControl(this.authorizeInfo.type),
      });
    }
}
