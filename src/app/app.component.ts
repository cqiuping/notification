import {Component, enableProdMode} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {Storage} from "@ionic/storage"
enableProdMode();
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.storeAccount();
    this.setRootPage();
  }

  private setRootPage(){
    this.storage.get('userId').then((val) => {
        console.log("app module token:" + val);
        if (val != null) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = LoginPage
        }
      }
    );
  }

  /**
   * 往storage存储appid和signkey
   */
  private storeAccount() {
    let appid = "34325ea00c0d319987a591f13f58b05b" ;
    let signkey = "a814700193125d1bd4196582b98d56c4";
    let accountMap = {
      appid: appid,
      signkey: signkey
    }
    this.storage.set("accountMap", accountMap);
  }
}
