import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';
// import {Http, RequestOptions, RequestOptionsArgs, Response,Headers} from '@angular/http';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Storage} from "@ionic/storage";


// import * as RSA from '../../assets/lib/RSA.js'
/*
 Generated class for the RestProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class RestProvider {
  token:string;

  constructor(public http: HttpClient,private storage:Storage) {
    this.storage.get('token').then((val) =>{
      this.token = val;
    })
    //console.log('Hello RestProvider Provider');
  }

  private baseUrl = "http://172.16.22.176:7083/api/ams/mobile";

  //feed
  private apiUrlFeeds = 'https://imoocqa.gugujiankong.com/api/feeds/get';

  //account
  private apiUrlRegister = 'http://172.16.22.176:9000/register';
  private apiUrlUserInfo = 'https://imoocqa.gugujiankong.com/api/account/userinfo';
  private apiUrlUpdateNickName = 'https://imoocqa.gugujiankong.com/api/account/updatenickname';
  //


  //* 注意：因为课程是主要讲解 ionic 的技术点
  //* 安全性方面你需要自己去做详细的设计和处理
  //* 密码的传递应该在传递参数之前进行加密，并且服务器端也应该进行相应的处理
  //* 具体的问题可以在慕课后台提问交流

  /**
   * 根据用户的手机号码和密码进行登录
   *
   * @param {any} mobile
   * @param {any} password
   * @returns {Observable<string[]>}
   * @memberof RestProvider
   */
  login(username, password){
    let param = {username, password};
    return this.http.post(this.baseUrl + "/login",param);
    // return this.postUrlReturn(this.baseUrl + "/login", param,null,false);
  }

  initEnc(): Observable<string[]> {
    return this.http.get(this.baseUrl + "/rsa")
  }

  getAlaram(): Observable<string[]> {
    return this.http.get(this.baseUrl + "/alarm");
  }

//   test() {
//     let headers = new Headers();
//     let username = "zmloper01@163.com";
//     let password = "123456";
//     headers.append('Content-Type', 'application/json');
//     // headers.append('Content-Type', 'application/x-www-form-urlencoded');
//     let id = 1;
//     // this.key = new RSAKeyPair(this.exponent,"",this.modulus);
//     // console.log(new RSAKeyPair("ABC12345", "", "987654FE"));
//     username = encryptedString(this.key,username);
//     password = encryptedString(this.key,password);
//     // console.log(enc.decode(username));
//     let param = {username,password};
//     // this.http.post('http://172.16.22.176:7083/api/ams/monitor/mobile/login',body,{headers:headers})
//     // this.http.get('http://172.16.22.176:7083/api/ams/monitor/ping')
//     // this.http.post('http://172.16.22.176:7083/api/ams/mobile/login',"",{headers:headers,params:{username:username,password:password}})
//     this.http.post('http://172.16.22.176:7083/api/ams/mobile/login',param)
// .subscribe(
//       res => {
//         console.log(res);
//       }
//     )
//   }
//   test3() {
//     this.http.post('http://172.16.22.176:8089/net/account/index?action=getParam', "", {params: {id: 1}})
//     .subscribe(
//       res => {
//         // console.log(res);
//         let data = res.json();
//         console.log(res.json());
//         // enc.init(data.data.exponent,data.data.modulus);
//         // enc.init(data.data.exponent,data.data.modulus);
//       }
//     );
//   }


  getUserInfo(userId): Observable<string[]> {
    return this.http.get(this.apiUrlUserInfo + "?userid=" + userId);
  }

  updateNickName(userId, nickname): Observable<string[]> {
    return this.http.get(this.apiUrlUpdateNickName + "?userid=" + userId + "&nickname=" + nickname);
  }


  // test() {
  //   return this.getUrlReturn(this.apiTestUrl);
  // }


  /**
   * 注册请求
   *
   * @param {any} mobile
   * @param {any} nickname
   * @param {any} password
   * @returns {Observable<string[]>}
   * @memberof RestProvider
   */
  register(mobile, nickname, password): Observable<string[]> {
    // let creds = {"mobile":mobile,"nickname":nickname,"password":password};
    // let headers = new Headers();
    // headers.append('Content-Type','application/json');
    // return this.http.post(this.apiUrlRegister,creds,{
    //   headers:headers
    // }).map(data => this.extractData(data))
    // .catch(err => this.handleError(err));
    return this.http.get(this.apiUrlRegister + "?mobile=" + mobile + "&nickname=" + nickname + "&password=" + password)
  }

  /**
   * 全局获取 HTTP  get请求的方法
   * @Parry
   * @private
   * @param {string} url
   * @returns {Observable<string[]>}
   * @memberof RestProvider
   */
  // private getUrlReturn(url: string, options?: RequestOptionsArgs,needToken=true): Observable<string[]> {
  //   if(needToken){
  //     if(options){
  //       // options.
  //       if(options.headers){
  //         options.headers.append('Authorization',this.token);
  //       }else{
  //         options.headers = new Headers();
  //         options.headers.append('Authorization', this.token);
  //
  //       }
  //     }else{
  //
  //       let headers = new Headers({'Authorization': 'Bearer ' + this.token})
  //       options = new RequestOptions({headers: headers});
  //     }
  //   }
  //   //http.get()返回的类型是Observable<Response>
  //   let res: Observable<Response> = options == null ? this.http.get(url) : this.http.get(url, options);
  //   return res.map(this.extractData).catch(this.handleError);
  // }

  /**
   * 全局获取 HTTP  post请求的方法
   * @param url
   * @param body
   * @param options
   * @returns {Observable<R|T>}
   */
  // private postUrlReturn(url: string, body: any, options?: RequestOptionsArgs,needToken=true): Observable<string[]> {
  //   if(needToken){
  //     if(options){
  //       // options.
  //       if(options.headers){
  //         options.headers.append('Authorization', this.token);
  //       }else{
  //         options.headers = new Headers({'Authorization': 'Bearer ' + this.token})
  //       }
  //     }else{
  //
  //       let headers = new Headers({'Authorization': 'Bearer ' + this.token})
  //       options = new RequestOptions({headers: headers});
  //     }
  //   }
  //   let res: Observable<Response> = options == null ? this.http.post(url, body) : this.http.post(url, body, options);
  //   return res.map(this.extractData).catch(this.handleError);
  // }


  /**
   * 处理接口返回的数据，处理成 json 格式
   *
   * @private
   * @param {Response} res
   * @returns
   * @memberof RestProvider
   */
  private extractData(res: Response) {
    let body = res.json();
    return (body instanceof Object) ? body : (JSON.parse(body) || {});
  }


  /**
   * 处理请求中的错误，考虑了各种情况的错误处理并在 console 中显示 error
   *
   * @private
   * @param {(Response | any)} error
   * @returns
   * @memberof RestProvider
   */
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
