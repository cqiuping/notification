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

/*
 Generated class for the RespInterceptorProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class RespInterceptorProvider implements HttpInterceptor {

  rest:any;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.rest = this.inj.get(RestProvider);
    return next.handle(req).catch(
      err =>{
        console.log( err);
        if(err instanceof HttpErrorResponse){
          if(err.status == 401){
            return  this.refreshToken()
            .flatMap(
              res =>{
                this.storage.remove('token');
                this.storage.set('token',res["responseParams"]);
                const authReq = req.clone({headers: req.headers.set('token','' + res["responseParams"])});
                console.log("response url:" + req.url);
                return next.handle(authReq);
              }
            );
          }else{
            throw err;
          }
        }

      });
  }

  constructor(private inj:Injector,private storage:Storage) {
  }

  refreshToken(){
    return new Observable(observer => {
      this.rest.getTokenFromServer()
      .subscribe((res) => {
        observer.next(JSON.parse(JSON.stringify(res)));
        observer.complete();
      })
    })
  }

}
