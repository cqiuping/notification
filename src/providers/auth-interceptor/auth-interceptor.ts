import {
  HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {Storage} from "@ionic/storage";

/*
 Generated class for the AuthInterceptorProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class AuthInterceptorProvider implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url);
    if (req.url.indexOf("ping") != -1 || req.url.indexOf("login") != -1 || req.url.indexOf("token") != -1) {
      return next.handle(req);
    } else {
      return this.getToken().flatMap(data => {
        console.log("auth token: " + JSON.stringify(data));
        const authReq = req.clone({headers: req.headers.set('token', data+'')});
        return next.handle(authReq);
      })
    }
  }

  constructor(private storage: Storage) {
  }

  private getToken(): Observable<Headers> {
    return Observable.fromPromise(this.storage.get('token'));
  }
}
