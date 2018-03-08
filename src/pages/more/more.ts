import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { BaseUI } from '../../common/baseui';
import { RestProvider } from '../../providers/rest/rest';
import { UserPage } from '../user/user';
import {Storage} from "@ionic/storage";
/**
 * Generated class for the MorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage extends BaseUI {

  public notLogin: boolean = true;
  public logined: boolean = false;
  headface: string;
  userinfo: string[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public loadCtrl: LoadingController,
              public rest: RestProvider,
              public storage:Storage) {
    super();
    console.log(this.storage.get('token'));
  }

  showModal() {
    let modal = this.modalCtrl.create(LoginPage);
    //关闭后的回调
    modal.onDidDismiss(()=>{
      // this.loadUserPage();
    });
    modal.present();
  }

  loadUserPage() {
    this.storage.get('token').then((val) => {

      if (val != null) {
      }
      else {
        this.notLogin = true;
        this.logined = false;
      }
    });
  }

  gotoUserPage() {
    this.navCtrl.push(UserPage);
  }
}
