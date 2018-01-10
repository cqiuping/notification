import {Component} from '@angular/core';
import {AlertController, NavController, ToastController} from 'ionic-angular';
import {BackgroundMode} from "@ionic-native/background-mode";
import {MediaObject, Media} from "@ionic-native/media";
import {RestProvider} from "../../providers/rest/rest";
import {BaseUI} from "../../common/baseui";
import {FaultPage} from "../fault/fault";
// import {LocalNotifications} from "@ionic-native/local-notifications";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseUI {
  topAlarms: any;
  unhandle: number;
  file: MediaObject;
  ws: any;
  /** webSocket连接标识**/
  wsConnect: any;

  constructor(public navCtrl: NavController,
              private rest: RestProvider,
              private media: Media,
              private alertCtrl: AlertController,
              // private localNotifications:LocalNotifications,
              private backgroundMode: BackgroundMode) {
    super();
  }

  /**
   * 页面将要进入时执行
   */
  ionViewWillEnter() {

  }


  /**
   * 页面进入之后执行，并且每次进入都会执行
   */
  ionViewDidEnter() {
    this.checkWebSocket();
    this.getAlarm();
    // this.poll();
    this.backgroundMode.on('activate').subscribe(
      () => {
        // this.poll();
        this.checkWebSocket();
      }
    )
  }

  /**
   * 页面加载完毕执行，并且只执行一次
   */
  ionViewDidLoad() {
    this.file = this.media.create("/android_asset/www/assets/file/music.mp3");
    this.conWebSocket();
  }


  /**
   * 连接webSocket
   */
  conWebSocket() {
    if ('WebSocket' in window) {
      // if(this.ws.readyState != WebSocket.CONNECTING){
      this.ws = new WebSocket('ws://172.16.0.44:7000' + '/ams/webSocket');
      let that = this;
      this.ws.onopen = function (event) {
        that.wsConnect = true;
        console.log('webSocket open');
      };
      // }
    }
  }

  /**
   * 检查webSocket状态，如果未连接就重新连接，如果已连接就监听消息
   */
  checkWebSocket() {
    if ('WebSocket' in window) {
      // if(this.wsConnect == false){
      //   this.ws = new WebSocket('ws://172.16.0.44:7000'  + '/ams/webSocket');
      // }
      setInterval(() => {
        console.log("interval");
        let that = this;
        this.ws.onopen = function () {
          that.wsConnect = true;
          console.log('webSocket open');
        };
        this.ws.onmessage = function (event) {
          // that.localNotifications.schedule({
          //   id:1,
          //   text:event.data
          // });
          console.log(event.data);
          that.playMusic(that.file);
        }
        this.ws.onClose = function () {
          console.log("connection closed");
          that.wsConnect = false;
          // this.ws = new WebSocket('ws://172.16.0.44:7000' + '/ams/webSocket');
          this.ws = new WebSocket('ws://192.168.137.1:7000' + '/ams/webSocket');
        }
        if (this.ws.readyState == WebSocket.CLOSED) {
          // this.ws = new WebSocket('ws://172.16.0.44:7000' + '/ams/webSocket');
          this.ws = new WebSocket('ws://192.168.137.1:7000' + '/ams/webSocket');
        }
      }, 5000);


    } else {
      alert("not support webSocket");
    }

  }


  /**
   * 认领操作
   * @param id
   */
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
      err => {
        console.log(err.message);
      }
    );

  }

  /**
   * 弹出确认框
   * @param id
   */
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

  /**
   * 下拉刷新
   * @param refresher
   */
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.getAlarm();
      refresher.complete();
    }, 2000);
  }

  /**
   * 跳转页面
   */
  toFaultPage() {
    this.navCtrl.push(FaultPage);
  }

  /**
   * 获取sys_event数据
   */
  private getAlarm() {
    this.rest.getAlaram()
    .subscribe(f => {
      this.topAlarms = f["responseParams"]["topAlarms"];
      this.unhandle = f["responseParams"]["unhandle"];
      // this.check(this.topAlarms, this.file);
    }, err => {
      console.log("get alarm error:" + err.message);
    });
  }

  /**
   * 循环播放音乐
   * @param file
   */
  private playMusic(file: MediaObject) {
    console.log("playMusic");
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
  }

  /**
   * 停止播放音乐
   * @param file
   */
  stopMusic(file: MediaObject) {
    file.stop();
    file.onStatusUpdate.subscribe(status => {
      console.log("stop status:" + status);
      if (status != 0 && status != 4) {
        console.log("stop stop stop");
        file.stop();
      }
    });
  }

  private poll() {
    setInterval(
      () => {
        this.rest.getAlaram()
        .subscribe(f => {
          let topAlarms = f["responseParams"]["topAlarms"];
          // this.check(topAlarms, this.file);
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
