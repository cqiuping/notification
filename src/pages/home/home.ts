import {Component} from '@angular/core';
import {AlertController, NavController, ToastController} from 'ionic-angular';
import {BackgroundMode} from "@ionic-native/background-mode";
import {MediaObject, Media} from "@ionic-native/media";
import {RestProvider} from "../../providers/rest/rest";
import {HttpErrorResponse} from "@angular/common/http";
import {BaseUI} from "../../common/baseui";
import {NativeAudio} from "@ionic-native/native-audio";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseUI {
  topAlarms: any;
  unhandle: number;
  file: MediaObject;

  constructor(public navCtrl: NavController,
              private rest: RestProvider,
              private media: Media,
              private alertCtrl: AlertController,
              private backgroundMode: BackgroundMode) {
    super();
  }

  //页面进入之后执行，并且每次进入都会执行
  ionViewDidEnter() {
    this.getAlarm();
    this.poll();
    this.backgroundMode.on('activate').subscribe(
      () => {
        this.poll();
      }
    )
  }

  //页面加载完毕执行，并且只执行一次
  ionViewDidLoad() {
    this.file = this.media.create("/android_asset/www/assets/file/music.mp3");
    this.file.play();
  }

  recv(id) {
    let ids = [];
    if (id == null) {

    } else {
      ids.push(id);
    }
    this.rest.recv(ids)
      .subscribe(
        res => {
          this.getAlarm();
        },
        err =>{
          console.log(err.message);
        }
      );

  }

  presentConfirm(id) {
    let alert = this.alertCtrl.create({
      message: '确认要认领吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '认领',
          handler: () => {
            this.recv(id);
            console.log('recv');
          }
        }
      ]
    });
    alert.present();
  }

  doRefresh(refresher){
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.getAlarm();
      refresher.complete();
    }, 2000);
  }

  private getAlarm(){
    this.rest.getAlaram()
    .subscribe(f => {
      this.topAlarms = f["responseParams"]["topAlarms"];
      this.unhandle = f["responseParams"]["unhandle"];
      this.check(this.topAlarms, this.file);
    },err=>{
      console.log("get alarm errror:" + err.message);
    });
  }

  private poll() {
    setInterval(
      () => {
        this.rest.getAlaram()
        .subscribe(f => {
         let topAlarms = f["responseParams"]["topAlarms"];
          this.check(topAlarms, this.file);
        })
      }, 6000
    )

  }

  private check(topAlarms, file: MediaObject) {
    if (topAlarms && topAlarms.length > 0) {
      var top1 = topAlarms[0];
      console.log(top1.alertLevel);
      if (top1.alertLevel == 1 || top1.alertLevel == 2) {
        file.play();
        //循环播放
        file.onStatusUpdate.subscribe(status => {
          console.log("play status:" + status);
          if (status == 0 || status == 4) {
            if (status == 4) {
              file.seekTo(0);
            }
            file.play();
          }
        });
      } else {
        file.stop();
        file.onStatusUpdate.subscribe(status => {
          console.log("stop status:" + status);
          if (status != 0 && status != 4) {
            console.log("stop stop stop");
            file.stop();
          }
        });
      }
    }
  }
}
