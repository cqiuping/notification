import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Media, MediaObject} from "@ionic-native/media";
import {BackgroundMode} from "@ionic-native/background-mode";

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  info : any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private media:Media,
              private backgroundMode: BackgroundMode) {
    backgroundMode.enable();
    backgroundMode.setDefaults(({
      title:'通知应用',
      text:'在后台运行'
    }));
    // backgroundMode.on('active')
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  playMusic(){
    const file:MediaObject = this.media.create("/android_asset/www/assets/file/music.mp3");
    file.onError.subscribe(error => this.info = error);
    file.play();

  }

}
