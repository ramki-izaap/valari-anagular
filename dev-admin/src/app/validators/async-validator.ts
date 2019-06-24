import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// SERVICES
import { UsersService } from '../services/users/users.service';

export class AsyncValidators {
  static validateStoreNOtTaken(usersService: UsersService, userId: string): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return usersService.getStoreByName(control.value).map((res: any) => {
        let result: any = null;
        if (res.status === 'success') {
          if (res.data) {
            result = {storeTaken: true};
            if (userId && res.data.user_id === userId) {
              result = null;
            }
          }
        }
        console.log(result);
        return result;
      });
    };
  }
}
