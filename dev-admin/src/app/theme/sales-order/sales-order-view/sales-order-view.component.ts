import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


import { AddressComponent } from '../../../shared/address/address.component';
// import { NotificationComponent } from '../../../theme/ui-elements/advance/notification/notification.component';
// SERVICES
import { AuthService } from '../../../services/auth/auth.service';
import { SalesOrderService } from '../../../services/sales-order/sales-order.service';

// INTERFACES
import { SalesOrderInterface, AddressInterface } from '../sales-order-interfaces';


@Component({
  selector: 'app-sales-order-view',
  templateUrl: './sales-order-view.component.html',
  styleUrls: ['./sales-order-view.component.scss']
})
export class SalesOrderViewComponent implements OnInit {
  @ViewChild (AddressComponent) child:AddressComponent;

  private addressFormControl: AddressInterface = {
    firstName:'',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    type: '',
    zip:0,
    phoneNumber:0,                   
  };

  refMsg: string ='';
  addressForm: FormGroup;
  private salesOrderId: string = null;
  public salesOrder: SalesOrderInterface;
  private billingAddress :AddressInterface;
  private shippingAddress :AddressInterface;
  private totalAmount: any;
  private orderStatus: string = '';

  public modalTitle:string = '';
  public div1:boolean = true;
  public div2:boolean = false;
  public div3:boolean = false;
  public div4:boolean = false;
  public updateshippingaddress:any;
  public shippingaddressvalue:any;
  public refundAmount:string;
  public VarShippingAddress:AddressInterface;
  public VarBillingAddress:AddressInterface;
  
  constructor(
              private salesOrderService: SalesOrderService, 
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService) { 

                
             const first_name     = new FormControl('', [Validators.required]);   
             const last_name     = new FormControl(this.addressFormControl.lastName, [Validators.required]);
             const address1     = new FormControl(this.addressFormControl.address1, [Validators.required]);
             const address2     = new FormControl(this.addressFormControl.address2, [Validators.required]);
             const city     = new FormControl(this.addressFormControl.city, [Validators.required]);
             const state     = new FormControl(this.addressFormControl.state, [Validators.required]);
             const country     = new FormControl(this.addressFormControl.country, [Validators.required]);
             const zip     = new FormControl(this.addressFormControl.zip, [Validators.required]);
             const phone_number     = new FormControl(this.addressFormControl.phoneNumber, [Validators.required]); 

             this.addressForm = new FormGroup({
              first_name: first_name,
              last_name: last_name,
              address1: address1,
              address2: address2,
              city: city,
              state: state,
              country: country,
              zip: zip,
              phone_number: phone_number,
     });
    
  }

  ngOnInit() {

    //this.createFormControls();

    this.route.params.subscribe(params => {
      this.salesOrderId = params.id;
      console.log('params', params);
      if (this.salesOrderId) {
           this.salesOrderService.getSalesOrders(this.salesOrderId)
            .subscribe(mappedSalesOrder => {                
            this.salesOrder = mappedSalesOrder;
            this.orderStatus = this.salesOrder.orderStatus;
            this.totalAmount = parseFloat(this.salesOrder.orderAmount);
            this.billingAddress = mappedSalesOrder.billingAddress;
            this.shippingAddress = mappedSalesOrder.shippingAddress;
            this.VarBillingAddress = mappedSalesOrder.billingAddress;
            this.VarShippingAddress = mappedSalesOrder.shippingAddress;
            this.refundAmount = this.salesOrder.orderAmount;
            console.log('Sales Order',this.salesOrder);
         });
       }
    });
  }

  addressUpdateModal(event) {
    document.querySelector('#' + event).classList.add('md-show');

    this.route.params.subscribe(params => {
      this.salesOrderId = params.id;
     });
    
    this.addressForm = new FormGroup({
      id: new FormControl(this.salesOrderId),
      first_name: new FormControl(this.shippingAddress.firstName),  
      last_name: new FormControl(this.shippingAddress.lastName),
      address1: new FormControl(this.shippingAddress.address1),
      address2: new FormControl(this.shippingAddress.address2),
      city: new FormControl(this.shippingAddress.city),
      state: new FormControl(this.shippingAddress.state),
      country: new FormControl(this.shippingAddress.country),
      zip: new FormControl(this.shippingAddress.zip),
      phone_number: new FormControl(this.shippingAddress.phoneNumber),         
    });
  }

  updateAddress(event) {
    this.route.params.subscribe(params => {
      this.salesOrderId = params.id;
     });
    this.updateshippingaddress = {
        id: this.salesOrderId,
        first_name:  this.addressForm.value.first_name,
        last_name: this.addressForm.value.last_name,
        address1: this.addressForm.value.address1,
        address2: this.addressForm.value.address2,
        city:this.addressForm.value.city,
        state:this.addressForm.value.state,
        country:this.addressForm.value.country,
        zip:this.addressForm.value.zip,
        phone_number: this.addressForm.value.phone_number,
     };
     console.log(this.salesOrderId);
      this.salesOrderService.updateAddress(this.updateshippingaddress).subscribe( resp => {
      console.log(resp);
      const httpResponse: any = resp;
      if (httpResponse.status === 'success') {
          alert('Saved Successfully');
          this.appentaddressValue(this.salesOrderId);
        } else {
          alert(resp.message);
        }
      
    });
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  updateOrderStatus() {
    console.log(this.orderStatus);
    this
      .salesOrderService
      .updateOrderStatus({id:this.salesOrder.id, status: this.orderStatus})
      .subscribe((res: any) => {
        if (res.status === 'success') {
          alert('Updated Successfully');
          this.ngOnInit();
        } else {
          alert(res.message);
        }
      })
  }

  appentaddressValue(id){
    this.salesOrderService.getAddress(id)
     .subscribe((res: any) => {
      this.shippingaddressvalue = res.address;
      this.shippingAddress.firstName = this.shippingaddressvalue.first_name;
      this.shippingAddress.lastName = this.shippingaddressvalue.last_name;
      this.shippingAddress.address1 = this.shippingaddressvalue.last_name;
      this.shippingAddress.address1 = this.shippingaddressvalue.address1;
      this.shippingAddress.address2 = this.shippingaddressvalue.address2;
      this.shippingAddress.city = this.shippingaddressvalue.city;
      this.shippingAddress.state = this.shippingaddressvalue.state;
      this.shippingAddress.country = this.shippingaddressvalue.country;
      this.shippingAddress.zip = this.shippingaddressvalue.zip;
      this.shippingAddress.phoneNumber = this.shippingaddressvalue.phone_number;
    });

  }
  getInvoice(){
    
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
    <head><link rel="stylesheet" type="text/css" href="http://localhost/clara-multi-vendor/assets/css/invoice.css" /></head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();

  }
 
  sentOrderEmail(id){
   
    this.salesOrderService.sentOrderEmail(id).subscribe( resp => {
      const httpResponse: any = resp;
      if (httpResponse.status === 'success') {
          alert('Order Email sent Successfully');
        } else {
          alert(resp.message);
        }

  });
}

  showModal(title:string='')
  {
    this.modalTitle = title;
    document.querySelector('#effect-1').classList.add('md-show');
  }
 
  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  confirmRefund(refundType:string)
  {
    
    this.div1 = false;
    this.div2 = true;
    console.log(this.refundAmount);
    let data = {id:this.salesOrderId,amount:this.refundAmount,type:refundType};
    console.log(data);
    this.salesOrderService.refundAmount(this.salesOrderId,refundType,this.refundAmount).subscribe((data)=>{
      console.log(data);
      this.div2 = false;
      if(data.status === 'success')
      {
        this.div3 = true;
      }
      else{
        this.div3 = false;
        this.div4 = true;
        this.refMsg = data.msg;
      }
      
    },(error)=>{
      console.log(error);
    });
  }

  refundOrder(type:string){
    this.div1 =  this.div2 = this.div3 = this.div4 = false;
    this.modalTitle = "Refund Amount";
    if(type=='partial'){
      this.div1 = true;
    }
    else{
      this.div2 = true;
      this.confirmRefund('full');
    }
    document.querySelector('#refund-modal').classList.add('md-show');
  }
  closerefundModal(){
    document.querySelector('#refund-modal').classList.remove('md-show');
  }

  
 
}

