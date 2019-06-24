import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class AppSettingsService {

  private apiUrl: string;

  // source for observable
  private commonModalSource: BehaviorSubject<CommonModalInterface> = new BehaviorSubject(null);
  // observable stream
  public commonModal$ = this.commonModalSource.asObservable();

  constructor(private http: HttpClient) {
    let protocol = 'http://';
    if (location.href.indexOf('https') !== -1) {
      protocol = 'https://';
    }
    this.apiUrl = protocol + 'localhost/clara-multi-vendor/api';
    if (location.href.indexOf('shopcsw') !== -1) {
      this.apiUrl = protocol + 'shopcsw.com/api/index.php';
    }
  }

  getApiUrl() {
    return this.apiUrl;
  }

  /**
   * setCommonModalData
   */
  public setCommonModalData(data: CommonModalInterface) {
    this.commonModalSource.next(data);
  }

  public getAll(): Observable<HttpResponse<any>> {

    return this
            .http
            .get<HttpResponse<any>>('/settings/all/');
  }

}

export interface CommonModalInterface {
  title: string;
  content: string;
  beforeDismiss?: any;
}

