import { Injectable } from '@angular/core';
import { HttpClient,
        HttpEvent,
        HttpInterceptor,
        HttpHandler,
        HttpRequest,
        HttpResponse,
        HttpHeaders,
        HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';

import { AppSettingsService } from '../app-settings.service';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private appSettingsService: AppSettingsService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiPath: string = this.appSettingsService.getApiUrl();
    let url = '';
    if (request.url.indexOf('http://') === 0 || request.url.indexOf('https://') === 0) {
      url = request.url;
    } else {
      url = apiPath + request.url;
    }

    let udata = '{}';
    if (localStorage.getItem('user_data')) {
      udata = localStorage.getItem('user_data');
    }
    request = request.clone({
      setHeaders: {
        user_data: udata
      },
      url: url,
      // reportProgress: true
    });

    // Make request
    return next.handle(request).map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        return event;
      }
    }).catch(errorResponse => {
      return Observable.throw(errorResponse);
    });

  }
}
