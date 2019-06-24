import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';

export class QstAsyncValidatorWrapper {

  /*
   * Angular async validators are triggered on every key stroke.
   * This function debounces triggering an async validator.
   *
   * How to use?
   * Let's say you have a function which asynchronously validates an email:
   *
   * function asyncEmailValidator (c: AbstractControl): Observable<any> {
   *    return checkInRemote();
   * }
   *
   * In your Reactive Form Builder instead of doing this:
   *
   * email: new FormControl("", [
   *    Validators.required
   * ], [
   *    asyncEmailValidator
   * ])
   *
   * Do this to debounce every 800ms:
   *
   * email: new FormControl("", [
   *    Validators.required
   * ], [
   *    QstAsyncValidatorWrapper.debounce(asyncEmailValidator, 800)
   * ])
   *
   * */
  public static debounce(asyncValidator: (c: AbstractControl) => Observable<any>,
                         time: number = 500): (c: AbstractControl) => Observable<any> {
    /*Starting a debouncing observable*/
    const subject: Subject<AbstractControl> = new Subject();

    const obs: Observable<any> = subject
        .debounceTime(time)
        .switchMap(abstractControl => asyncValidator(abstractControl))
        .share();

    /*Need to have at least 1 active subscriber, because otherwise
     * the first `subject.next(c)` event won't be registered*/
    obs.subscribe();

    return (c: AbstractControl) => {
      /*Every time this function is invoked by Angular I must inform a subject about it*/
      subject.next(c);

      /*Need to take only one for every function invocation,
       * because the subscription must complete.
       * Otherwise Angular form state would be "PENDING"*/
      return obs.first();
    };
  }
}
