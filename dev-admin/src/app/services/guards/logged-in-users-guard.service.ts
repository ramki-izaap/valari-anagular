import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Router} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LoggedInUsersGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate() {
    // this.router.navigate(['auth/login/simple']);
    return this.authService.authStatus$.map(flag => {
      // if (!flag) {
      //   // check if user-data is available in Localstorage. if yes, the consider as loggedin
      //   const userData: any = JSON.parse(localStorage.getItem('user_data'));
      //   console.log('userData', userData);
      //   if (!userData) {
      //     this.router.navigate(['auth/login/simple']);
      //   }
      // }
      // return flag;
      return true;
    });
  }

}
