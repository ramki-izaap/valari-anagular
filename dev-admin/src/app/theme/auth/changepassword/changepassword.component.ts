import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { UsersService } from '../../../services/users/users.service';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],

})
export class ChangepasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isLoggedIn = false;
  changePasswordFormFields: any = {
                              new_password: '',
                              confirm_password: '' };
  public userID: string;
  public userInfo: any;
  constructor(private user: UsersService,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService
            ) {
    const new_password     = new FormControl(this.changePasswordFormFields.new_password, Validators.compose([Validators.required,Validators.minLength(6)]));
    const confirm_password = new FormControl(this.changePasswordFormFields.confirm_password, [Validators.required]);

    this.changePasswordForm = new FormGroup({
      new_password: new_password,
      confirm_password: confirm_password
    }

  );

   this.userInfo = this.auth.getUserInfo();
   if (this.userInfo !== '') {
    this.isLoggedIn = true;
   }

}

  ngOnInit() {

    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');

    this.route.params.subscribe(params => {
      console.log('params', params);
      console.log(atob('cGFzc3dvcmQ='));
      // Base64.decode();

      if (params.id) {
        this.userID = atob(params.id);
        // this.userID = params.id;
      } else {
        this.router.navigate(['/login']);
      }
       console.log(this.userID);

    });

  }

  changePassword() {

    if (this.changePasswordForm.value.new_password !== this.changePasswordForm.value.confirm_password) {
      alert('Password Mismatch');
      return false;
    }

    // this.userID = (this.userID > 0) ? this.userID : this.userInfo.id;

    this.user.changePassword(this.userID, this.changePasswordForm.value.new_password)
             .subscribe((res: any) => {
             const httpResponse = res;
             if (httpResponse.status === 'success') {
               alert('Password Changed Successfully');
               this.router.navigate(['/auth/login/simple']);
             }
    });
  }

}

