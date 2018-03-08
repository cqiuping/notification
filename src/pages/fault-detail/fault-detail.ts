import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {Fault} from "../../entity/fault";

/**
 * Generated class for the FaultDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fault-detail',
  templateUrl: 'fault-detail.html',
})
export class FaultDetailPage {
  eventId: number;
  fault: Fault = {};
  levels = {"1": "严重级别", "2": "二级故障", "3": "三级故障", "4": "四级故障", "5": "五级故障", "6": "其它故障"};

  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              private alertCtrl:AlertController,
              private rest: RestProvider,
              public navParams: NavParams) {
    this.eventId = this.navParams.get("eventId");
  }

  ionViewDidEnter() {
    this.getFault();
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
          this.getFault();
        },
        err => {
          console.error(err.message);
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
      cssClass:'new-alert-message',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
        },
        {
          text: '认领',
          handler: () => {
            this.recv(id);
          }
        }
      ]
    });
    alert.present();
  }


  getFault() {
    this.rest.getFault(this.eventId).subscribe(
        res => {
          this.fault = res["data"];
        }, err => {
          console.error("fault-detail get fault error:" + err.message);
        }
    )
  }

}
