import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Media, MediaObject} from "@ionic-native/media";
import {BackgroundMode} from "@ionic-native/background-mode";
import {RestProvider} from "../../providers/rest/rest";
import {NativeAudio} from "@ionic-native/native-audio";

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
              private backgroundMode: BackgroundMode,
              private rest: RestProvider,
              private nativeAudio:NativeAudio) {
    backgroundMode.enable();
    backgroundMode.setDefaults(({
      title:'通知应用',
      text:'在后台运行'
    }));

    // backgroundMode.on('active')
  }



  playMusic(){
    // this.nativeAudio.preloadSimple('music','assets/file/alarm.wav').then(function(msg){
    //
    // }, function(msg){
    //   alert( 'error: ' + msg );
    // });
    const file:MediaObject = this.media.create("/android_asset/www/assets/file/music.mp3");
    file.play();
    file.onSuccess.subscribe(() => alert('Action is successful'));
    file.onError.subscribe(error => alert(error));
    // file.status.subscribe((status) => {
    //   if(status === Media.MEDIA_STOPPED) media.play();
    // });
    // this.nativeAudio.loop('music').then(function(msg){
    // }, function(msg){
    //   alert("notifiaction error:" + msg)
    // });

  }
  testObservable(){
  }

}
