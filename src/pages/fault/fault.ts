import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, ViewController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {UserPage} from "../user/user";

/**
 * Generated class for the FaultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fault',
  templateUrl: 'fault.html',
})
export class FaultPage {
  alertLevels;
  eventStates;
  faultStates;
  faultTypes;


  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              private menu: MenuController,
              public navParams: NavParams) {
    // this.menu.enable(true);
    this.initData();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * 初始化筛选条件
   */
  private initData() {
    this.alertLevels = [{label: '全部级别', value: 0}, {label: '通知级别', value: 3}, {
      label: '警告级别',
      value: 2
    }, {label: '严重级别', value: 1}];
    this.eventStates = [{label: '全部状态', value: null}, {label: '已恢复', value: 3}, {
      label: '已处理',
      value: 2
    }, {label: '已认领', value: 1}, {label: '未认领', value: 0}];
    this.faultStates = [{label: '全部状态', value: -1}, {label: '已恢复', value: 3}, {
      label: '未恢复',
      value: 4
    },
      {label: '已处理', value: 2}, {label: '已认领', value: 1}, {label: '未认领', value: 0}];
    this.faultTypes = [{label: "所有故障", value: ''},
      {label: "网关故障", value: '网关'},
      {label: "通道故障", value: '通道'},
      {label: "透传故障", value: '透传'},
      {label: "系统故障", value: '系统'},
      {label: "数据库故障", value: '数据库'},
      {label: "其它故障", value: '其它'}];
  }


}
