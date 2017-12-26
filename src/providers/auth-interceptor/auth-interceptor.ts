import {
  HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
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
    if (req.url.indexOf("rsa") != -1 || req.url.indexOf("login") != -1) {
      return next.handle(req);
    } else {
      console.log(req.url);
      if(this.token != null){
        const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + this.token)});
        return next.handle(authReq);
      }

    }
  }

  constructor(private storage: Storage) {
    this.storage.get('token').then((val) => {
      this.token = val;
    })
  }

}
