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
declare var encryptedString;
declare var setMaxDigits;
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
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public loadingCtrl: LoadingController,
              public rest: RestProvider,
              public toastCtrl: ToastController,
              public storage: Storage,
              private app: App) {
    super(); //调用父类的构造函数 constructor
    this.rest.initEnc()
    .subscribe(
      res => {
        setMaxDigits(res["responseParams"]["modulus"].length / 2 + 3);
        this.key = new RSAKeyPair(res["responseParams"]["exponent"], "", res["responseParams"]["modulus"]);
      }
    );
  }

  login() {
    let newusername = encryptedString(this.key, this.username);
    let newpassword = encryptedString(this.key, this.password);
    var loading = super.showLoading(this.loadingCtrl, "登录中...");
    this.rest.login(newusername, newpassword)
    .subscribe(
      (res) => {
        if (res["errorCode"] != null) {
          super.showToast(this.toastCtrl, res["errorMsg"]);
        } else {
          this.app.getRootNav().setRoot(TabsPage);
          this.storage.set("token", JSON.stringify(res["responseParams"]));
        }
        loading.dismiss();
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          super.showToast(this.toastCtrl, err.error);
        }
      }
    );
    // .subscribe(
    //   f => {
    //     console.log(f);
    //     if (f["errorCode"] != null) {
    //       super.showToast(this.toastCtrl, f["errorMsg"])
    //     } else {
    //       this.app.getRootNav().setRoot(TabsPage);
    //       this.storage.set("token", JSON.stringify(f["responseParams"]));
    //       console.log(this.storage.get("token"));
    //       loading.dismiss();
    //       // this.dismiss();
    //     }
    //   //处理登录成功的页面跳转
    //   //你也可以存储接口返回的 token
    //   this.storage.set('UserId', f["UserId"]);
    //   loading.dismiss();
    //   this.dismiss();
    // }
    // else {
    //   loading.dismiss();
    //   super.showToast(this.toastCtrl, f["StatusContent"]);
    // }
    // },
    // error => this.errorMessage = <any>error);
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
