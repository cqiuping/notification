import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Storage} from "@ionic/storage";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {FaultParam} from "../../entity/faultParam";
declare var encryptedString;

// import * as RSA from '../../assets/lib/RSA.js'
/*
 Generated class for the RestProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
 */
@Injectable()
export class RestProvider {

  constructor(public http: HttpClient, private storage: Storage) {
  }

  private baseUrl = "http://172.16.22.176:7083/api/ams/mobile";
  // private baseUrl = "http://192.168.137.1:7083/api/ams/mobile";
  // private baseUrl = "http://172.16.0.44:7000/api/ams/mobile";

  //feed
  private apiUrlFeeds = 'https://imoocqa.gugujiankong.com/api/feeds/get';

  //account
  private apiUrlRegister = 'http://172.16.22.176:9000/register';
  private apiUrlUserInfo = 'https://imoocqa.gugujiankong.com/api/account/userinfo';
  private apiUrlUpdateNickName = 'https://imoocqa.gugujiankong.com/api/account/updatenickname';
  //


  /**
   * 获取工单信息
   * @param param
   * @returns {Observable<Object>}
   */
  getFaultTable(param:FaultParam){
    return this.http.post(this.baseUrl + "/fault", param);
  }

  getRecvUsername(param:FaultParam){
    return this.http.post(this.baseUrl + "/recvUsername",param);
  }
  /**
   * 根据用户的手机号码和密码进行登录
   *
   * @param {any} mobile
   * @param {any} password
   * @returns {Observable<string[]>}
   * @memberof RestProvider
   */
  login(username, password, key) {
    return Observable.fromPromise(this.storage.get("accountMap"))
    .flatMap(val => {
      console.log(val);
      if (val != null && val.appid != null && val.signkey != null) {
        console.log(key);
        let newAppid = encryptedString(key, val.appid);
        let newSingkey = encryptedString(key, val.signkey);
        username = encryptedString(key, username);
        password = encryptedString(key, password);
        console.log(password);
        let headers = new HttpHeaders({"appid": newAppid, "signkey": newSingkey});
        console.log(headers.get("appid"));
        // headers.append("appid", newAppid);
        // headers.append("signkey", newSingkey);
        let param = {username, password};
        let newAccountMap = {appid: newAppid, signkey: newSingkey};
        this.storage.set("newAccountMap", newAccountMap);
        return this.http.post(this.baseUrl + "/login", param, {headers: headers});
      }
    });
    // return this.postUrlReturn(this.baseUrl + "/login", param,null,false);
  }

  /**
   * 获取token
   * @returns {Observable<R>}
   */
  getTokenFromServer() {
    return Observable.fromPromise(this.storage.get("newAccountMap"))
    .flatMap((map) => {
      console.log("get token:" + map);
      if (map != null && map.appid != null && map.signkey != null) {
        let headers = new HttpHeaders({"appid": map.appid, "signkey": map.signkey});
        console.log(headers.get("appid"));
        return this.http.get(this.baseUrl + "/token", {headers: headers});
      }
    });
  }

  /**
   * 获取公钥
   * @returns {Observable<Object>}
   */
  initEnc() {
    return this.http.get(this.baseUrl + "/ping")
  }


  /**
   * 获取Top5 alarm
   * @returns {Observable<Object>}
   */
  getAlaram() {
    return this.http.get(this.baseUrl + "/alarm");
  }

  statisticsHostPie(){
    return this.http.get(this.baseUrl + "/statisticsHostPie");
  }

  statisticsAppPie(){
    return this.http.get(this.baseUrl + "/statisticsAppPie");
  }

  statisticsNodePie(){
    return this.http.get(this.baseUrl + "/statisticsNodePie");
  }

  /**
   * 认领工单
   * @param ids
   * @returns {Observable<R>|OperatorFunction<T, R|I>}
   */
  recv(ids: number[]) {
    console.log("recv faulter");
    return Observable.fromPromise(this.storage.get("userId"))
    .flatMap((userId) => {
      if(userId != null){
        return this.http.post(this.baseUrl + "/recv", {ids,userId});
      }else{
        console.log("找不到userId");
      }
    })
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
