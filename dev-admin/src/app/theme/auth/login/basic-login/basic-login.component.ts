import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {Router} from '@angular/router';

import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';

import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-basic-login',
  templateUrl: './basic-login.component.html',
  styleUrls: ['./basic-login.component.scss']
})
export class BasicLoginComponent implements OnInit {

  public loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  rememberMe: FormControl;
  public errorMessage: string;
  private _success = new Subject<string>();
  constructor(private router: Router, private formBuilder: FormBuilder, private auth: AuthService) {

  }

  ngOnInit() {
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
    this.createFormControls();

    // Error message displayer
    this._success.subscribe((message) => this.errorMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.errorMessage = null);

  }

  onKeydown(event) {
    if (event.key === "Enter") {
        this.doLogin();
    }
  }

  doLogin() {

    if (this.loginForm.invalid) {
      return;
    }

    this.auth.login(this.loginForm.value).subscribe((httpResponse: any) => {
      if (httpResponse.status === 'error') {
        this._success.next(httpResponse.message);
      } else {
        this.router.navigate(['dashboard']);
      }
    });
  }

  private createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);
    this.rememberMe = new FormControl('', []);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }
}
