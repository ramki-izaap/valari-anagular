import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
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
export class SettingsComponent implements OnInit {
  settingShippingForm: FormGroup;
  userInfo: any;
  public settingFormSubmitted:boolean = false;
  shippingCost:any;
  constructor(private user: UsersService,
              private auth: AuthService
            ) {

    //get current loggedin userinfo          
    this.userInfo = this.auth.getUserInfo();           

    //get already stored shipping cost
    this.user.getShippingCost(this.userInfo.id).subscribe( resp => {
      const httpResponse: any = resp;
      console.log(httpResponse);
      this.shippingCost = httpResponse.info.value; 
    });          
    
    console.log(this.shippingCost);
    //validation 
    const cost  = new FormControl(this.shippingCost, [Validators.required]);
    this.settingShippingForm = new FormGroup({
        shipping_cost: cost
      }
    );
    
    
   }

  ngOnInit() {

    


  }

  settingShippingUpdate(){


    this.settingFormSubmitted = true;
    if (this.settingShippingForm.invalid) {
      return;
    }
    
    this.user.shippingSetting(this.settingShippingForm.value.shipping_cost,this.userInfo.id).subscribe( resp => {
        
        const httpResponse: any = resp;
        //if (httpResponse.status === 'error') {
          alert(httpResponse.message);
       // } 
    });

  }

}
