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

  constructor(public http: HttpClient,private storage:Storage) {
    //console.log('Hello RestProvider Provider');
  }

  // private baseUrl = "http://172.16.22.176:7083/api/ams/mobile";
  private baseUrl = "http://192.168.137.1:7083/api/ams/mobile";

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

  initEnc() {
    return this.http.get(this.baseUrl + "/rsa")
  }

  getAlaram(){
    return this.http.get(this.baseUrl + "/alarm");
  }

  blank(){
    return this.http.get(this.baseUrl + "/blank");
  }

  /**
   * 注册请求
   *
   * @param {any} mobile
   * @param {any} nickname
   * @param {any} password
   * @returns {Observable<string[]>}
   * @memberof RestProvider
   */
  // register(mobile, nickname, password): Observable<string[]> {
  //   // let creds = {"mobile":mobile,"nickname":nickname,"password":password};
  //   // let headers = new Headers();
  //   // headers.append('Content-Type','application/json');
  //   // return this.http.post(this.apiUrlRegister,creds,{
  //   //   headers:headers
  //   // }).map(data => this.extractData(data))
  //   // .catch(err => this.handleError(err));
  //   return this.http.get(this.apiUrlRegister + "?mobile=" + mobile + "&nickname=" + nickname + "&password=" + password)
  // }

}
