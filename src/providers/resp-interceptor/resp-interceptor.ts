import {
  HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap'
import {RestProvider} from "../rest/rest";
import {Storage} from "@ionic/storage";
import {App, ToastController} from "ionic-angular";
import {LoginPage} from "../../pages/login/login";
import {BaseUI} from "../../common/baseui";

/*
 Generated class for the RespInterceptorProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class RespInterceptorProvider extends BaseUI implements HttpInterceptor {

  rest: any;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.rest = this.inj.get(RestProvider);
    return next.handle(req).do(
        res => {
          if (res["body"] != null) {
            //对于返回的参数的status不为0并且状态码为200的请求，抛出错误
            if (res["body"]["status"] != 0) {
              let error = {message: res["body"]["errorMsg"]};
              throw error;
            }
          }
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401) {
              this.app.getRootNav().setRoot(LoginPage);
              super.showToast(this.toastCtrl, "抱歉，由于权限限制，您需要重新登陆")
              return;
            } else {
              throw err;
            }
          }
        }
    )
  }

  constructor(private inj: Injector, private storage: Storage, public app: App, private toastCtrl: ToastController) {
    super();
  }

  refreshToken() {
    return new Observable(observer => {
      this.rest.getTokenFromServer()
      .subscribe((res) => {
        observer.next(JSON.parse(JSON.stringify(res)));
        observer.complete();
      })
    })
  }

}
