import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';

// SERVICES
import { ShippingChargeService } from '../../../services/shipping-charge/shipping-charge.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

// INTERFACE
import { ShippingChargeInterface } from './shipping-charge-add.interface'
import { AppSettingsService, CommonModalInterface } from './../../../services/app-settings.service';

@Component({
  selector: 'app-shipping-add',
  templateUrl: './shipping-add.component.html',
  styleUrls: ['./shipping-add.component.scss']
})
export class ShippingAddComponent implements OnInit {

  private shippingCharge: ShippingChargeInterface;
  public shippingChargeForm: FormGroup;
  public shippingChargeFormSubmitted:boolean = false;
  private shippingType: FormControl;
  private shippingCost: FormControl;
  private shippingName: FormControl;

  constructor(private router: Router,private ShippingChargeService: ShippingChargeService,private route: ActivatedRoute,private modalService: NgbModal,
    private appSettingsService: AppSettingsService) { 

      this.shippingCharge = {
        shippingName:'',
        userId: '0',
        shippingType:'',
        shippingCost: '0'
      };
    }

  ngOnInit() {

    this.route.params.subscribe(params => {
      console.log(params);
      if (params.id) {
        this.ShippingChargeService.getShippingCharge(params.id)
          .subscribe(mappedShipping => {
            this.shippingCharge = mappedShipping;
            console.log('test',this.shippingCharge);
            this.createFormControls();
          });
      } else {
        this.createFormControls();
      }
    });
  }

  submit() {
    console.log(this.shippingChargeForm.invalid, this.shippingChargeForm);
    this.shippingChargeFormSubmitted = true;
    if (this.shippingChargeForm.invalid) {
      return;
    }
    
    this.shippingCharge = {
      shippingName: this.shippingCharge.shippingName,
      userId: this.shippingCharge.userId,
      shippingType: this.shippingChargeForm.value.shippingType,
      shippingCost:this.shippingChargeForm.value.shippingCost,
      
    };
  
    if (this.shippingCharge.userId === '0') {
      console.log('1111');
      this
        .ShippingChargeService
        .createShippingCharge(this.shippingCharge)
        .subscribe((resp: any) => {
          console.log(resp);
          let modalData: CommonModalInterface = null;
          if (resp.status === 'success') {
            modalData = {
              title: 'Success',
              content: 'Shipping Charge created successfully',
              beforeDismiss: () => {
                this.router.navigate(['/shipping-charge/list']);
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
        .ShippingChargeService
        .updateShippingCharge(this.shippingCharge)
        .subscribe((resp: any) => {
          console.log(resp);
          let modalData: CommonModalInterface = null;
          if (resp.status === 'success') {
            modalData = {
              title: 'Success',
              content: 'Shipping Charge updated successfully',
              beforeDismiss: () => {
                this.router.navigate(['/shipping-charge/list']);
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

  private createFormControls() {
 
    console.log('shipping',this.shippingCharge);
    this.shippingType = new FormControl(this.shippingCharge.shippingType, [
      Validators.required
    ]);
    this.shippingCost = new FormControl(this.shippingCharge.shippingCost, [
      Validators.required
    ]);
    this.shippingName = new FormControl(this.shippingCharge.shippingName, [
      Validators.required
    ]);
    
    this.shippingChargeForm = new FormGroup({
      shippingName: this.shippingName,
      shippingType: this.shippingType,
      shippingCost:this.shippingCost,
    });
  
  }

}
