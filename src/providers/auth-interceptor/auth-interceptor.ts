import {
  HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import {Storage} from "@ionic/storage";

/*
 Generated class for the AuthInterceptorProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class AuthInterceptorProvider implements HttpInterceptor {
  token: any;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url);
    if (req.url.indexOf("rsa") != -1 || req.url.indexOf("login") != -1) {
      return next.handle(req);
    } else {
      console.log(this.getToken());
      return this.getToken().flatMap(data => {
        const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + data)});
        return next.handle(authReq);
      })
    }
  }

  constructor(private storage: Storage) {
    this.getToken();
  }

  private getToken(): Observable<Headers> {
    return Observable.fromPromise(this.storage.get("token"));
  }
}
