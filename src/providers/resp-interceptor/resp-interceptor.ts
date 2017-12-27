import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest, HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';
import {LoginPage} from "../../pages/login/login";
import {NavController} from "ionic-angular";

/*
 Generated class for the RespInterceptorProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class RespInterceptorProvider implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do((event) => {
      console.log(event);
      if (event instanceof HttpResponse) {
        console.log("httpresponse");
        // do stuff with response if you want
        console.log("event");
      }
    }, (err:any) => {
      console.log(err);
      // if (err instanceof HttpErrorResponse) {
      //   console.log(err);
      // }
      //   if (err.status === 401) {
      //     console.log("401 error");
      //     // this.navCtrl.push(LoginPage);
      //   // }
      // }
    });
  }

  constructor() {
  }

}
