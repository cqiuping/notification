import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  ToastController
} from 'ionic-angular';
import {BaseUI} from '../../common/baseui';
import {RestProvider} from '../../providers/rest/rest';
import {RegisterPage} from '../register/register';
import {App} from 'ionic-angular'
import {TabsPage} from "../tabs/tabs";
import {Storage} from "@ionic/storage";
import {HttpErrorResponse} from "@angular/common/http";
declare var RSAKeyPair;
declare var setMaxDigits;
declare var encryptedString;
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseUI {

  key: any;
  username: any;
  password: any;
  errorMessage: any;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public loadingCtrl: LoadingController,
              public rest: RestProvider,
              public toastCtrl: ToastController,
              public storage: Storage,
              public app: App) {
    super();
  }

  ionViewDidEnter(){
    this.rest.initEnc()
    .subscribe(
        res => {
          console.log("hlaha");
          console.log(res["data"]["modulus"])
          setMaxDigits(res["data"]["modulus"].length / 2 + 3);
          this.key = new RSAKeyPair(res["data"]["exponent"], "", res["data"]["modulus"]);
        }, error => {
          console.log("initEnc error:" + error.message);
        }
    );
  }

  login() {
    var loading = super.showLoading(this.loadingCtrl, "登录中...");

    this.rest.login(this.username, this.password, this.key)
   .subscribe(
        (res) => {
          // if (res["status"] != 0) {
          //   super.showToast(this.toastCtrl, res["errorMsg"]);
          //   loading.dismiss();
          // } else {
          console.log("res");
          console.log(res);
          this.storage.set("userId", res["data"]["userId"]);
          this.app.getRootNav().setRoot(TabsPage);
          this.storage.set("key", JSON.stringify(this.key));
          loading.dismiss();
          // let headers = res.headers;
          // }
        },
        (err) => {
          super.showToast(this.toastCtrl, err.message);
          loading.dismiss();
        }
    );
  }


  /**
   * 关闭当前页面的方法
   *
   * @memberof LoginPage
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  pushRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

}
