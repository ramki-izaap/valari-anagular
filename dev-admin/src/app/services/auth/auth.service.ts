import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';
@Injectable()
export class AuthService {
   public userInfo;
   public userName;
  // source for observable
  private authStatusSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // observable stream
  public authStatus$ = this.authStatusSource.asObservable();
  constructor(private http: HttpClient, @Inject('LOCALSTORAGE') private localStorage: any) { }

  /**
   * login
   */
  public login(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this
      .http
      .post<HttpResponse<any>>('/users/login', params, httpOptions).map(resp => {
        const httpResponse: any = resp;
        console.log(httpResponse);
        if (httpResponse.status && httpResponse.status === 'success') {
          localStorage.setItem('user_data', JSON.stringify(httpResponse.user_info));
          this.authStatusSource.next(true);
        }
        return httpResponse;
      })
      .catch(loginError => {
        return Observable.throw(loginError);
      });
  }

  /**
   * logout
   */
  public logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('user_data');
      this.authStatusSource.next(false);
      resolve(true);
    });
  }

  /**
   * listUsers
   */
  public listUsers(params: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this
      .http
      .post<HttpResponse<any>>('/users/list', params, httpOptions).map(resp => {
        const httpResponse: any = resp;
        console.log(httpResponse);
        return httpResponse;
      })
      .catch(loginError => {
        return Observable.throw(loginError);
      });
  }

  public getUserRole(): string {
    const userData: any = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
      return userData.role;
    }
    return 'A';
  }


  public getUserInfo() {
     this.userInfo = JSON.parse(localStorage.getItem('user_data'));
     return this.userInfo;
  }

  public getUserName() {
    this.userName = JSON.parse(localStorage.getItem('user_data'));
     return this.userName.first_name + ' ' + this.userName.last_name;
  }

  public getUserId() {

    this.userInfo = JSON.parse(localStorage.getItem('user_data'));

    return this.userInfo.id;

  }

}
