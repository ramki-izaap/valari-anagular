import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { animate, state, transition, trigger, style, keyframes } from '@angular/animations';

import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  animations: [ trigger('load', [
    transition(':enter', [
        style({ opacity: 0}),
        animate(600, style({ opacity: 1 }))
    ]),
    transition(':leave', [
        style({ opacity: 1 }),
        animate(2000, style({ opacity: 0 }))
    ])
  ])
]
})

export class ForgotComponent implements OnInit {

  public forgotPasswordForm: FormGroup;
  private email: string;
  public emailSent: boolean;
  public validation: ValidationInterface;
  constructor(private user: UsersService) {
    this.emailSent = false;
    const email  = new FormControl(this.email, [Validators.required, Validators.email]);
    this.forgotPasswordForm = new FormGroup({email: email});
  }

  forgotPassword() {

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.user.forgotPassword(this.forgotPasswordForm.value.email).subscribe(resp => {
      console.log(resp);
      const httpResponse: any = resp;
      if (httpResponse.status === 'success') {
        this.emailSent = true;
      } else if (httpResponse.message) {
        this.validation = {
          isValid: false,
          message: httpResponse.message
        };

        setTimeout(() => {
          this.validation = null;
        }, 3000);
      }
    });

  }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
  }

}


export interface ValidationInterface {
  isValid: boolean;
  message: string;
}
