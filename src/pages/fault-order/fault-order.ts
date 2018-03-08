import {Component} from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {FaultParam} from "../../entity/faultParam";
import {BaseUI} from "../../common/baseui";
import {FaultDetailPage} from "../fault-detail/fault-detail";

/**
 * Generated class for the FaultOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-fault-order',
  templateUrl: 'fault-order.html',
})
export class FaultOrderPage extends BaseUI{
  faultLists;
  alertLevels;
  faultStates;
  faultTypes;
  recvUsernames;
  param: FaultParam = {};
  defaultColor = "#b8b8b8";
  newColor = "#324558";
  defaultValue = {alertLevel: 0, faultState: -1, faultType: ''};
  selectedFaultState;

  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              private modalCtrl: ModalController,
              private rest: RestProvider,
              private toast: ToastController) {
    super();
  }

  ionViewWillEnter() {
    this.initData();
    this.getFaultTabele();
    this.getRecvUsername(this.param);
  }

  ionViewDidEnter() {
    document.getElementById("faultStates_" + this.faultStates[4].value).style.backgroundColor = this.newColor;
  }

  /**
   * 获取工单信息
   * @param param
   */
  getFaultTabele() {
    this.rest.getFaultTable(this.param)
    .subscribe(
        res => {
          this.faultLists = res["data"];
        },
        err => {
          console.error("获取工单错误:" + err.message);
          super.showToast(this.toast, "获取工单错误");
        }
    )
  }

  /**
   *根据请求到的工单信息获取认领用户
   * @param param
   */
  getRecvUsername(param: FaultParam) {
    this.rest.getRecvUsername(param)
    .subscribe(
        res => {
          this.initRecvUsernames(res["data"]);
        },
        err => {
          console.error("获取认领用户错误:" + err.message);
          super.showToast(this.toast, "获取认领用户有误");
        }
    )
  }

  /**
   * 跳转到“工单明细”页面
   */
  gotoDetail(eventId) {
    let modal = this.modalCtrl.create(FaultDetailPage, {eventId: eventId});
    modal.present();
    modal.onDidDismiss(()=>{
      this.getFaultTabele();
    });
  }

  /**
   * 选中一个元素的时候调用
   * @param arr 选中元素所在数组
   * @param value 选中元素的值
   */
  clickOne(arr, value) {
    let tmpArr = this[arr + 's'];
    if (tmpArr != null) {
      this.initItem(arr);
      for (let i = 0; i < tmpArr.length; i++) {
        if (tmpArr[i].value == value) {
          if (tmpArr[i].checked == true) {
            tmpArr[i].checked = false;
            /** 给selectedFaultState赋值 **/
            this.selectedFaultState = "所有状态";
          } else {
            this.otherToFalse(arr, value);
            this.selectedFaultState = tmpArr[i].label;
          }
        } else {
          continue;
        }
        let item = document.getElementById(arr + 's_' + value);
        if (item == null) {
          super.showToast(this.toast, "所选中元素id不存在");
          return;
        }
        if (tmpArr[i].checked == true) {
          item.style.backgroundColor = this.newColor;
          this.param[arr] = value;
        } else {
          item.style.backgroundColor = this.defaultColor;
          this.param[arr] = this.defaultValue[arr];
        }
        this.getFaultTabele();
        this.getRecvUsername(this.param);
      }
    }
  }

  /**
   * 筛选的时候选中数组中一个元素，其他元素的checked设置为false
   * @param arr 当前参数数组
   * @param value 当前选中的值
   */
  otherToFalse(arr, value) {
    let tmpArr = this[arr + 's'];
    if (tmpArr != null) {
      for (let i = 0; i < tmpArr.length; i++) {
        if (tmpArr[i].value != value) {
          tmpArr[i].checked = false;
        } else {
          tmpArr[i].checked = true;
        }
      }
    } else {
      super.showToast(this.toast, 'otherToFalse错误，数组为空');
    }
  }

  /**
   * 点击取消按钮时触发
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * 对请求到的recvUsernames初始化checked元素
   * @param recvUsernames
   */
  private initRecvUsernames(recvUsernames) {
    if (recvUsernames != null) {
      console.log("recvUsernames:" + recvUsernames[0]);
      if (this.recvUsernames == null || this.recvUsernames.length == 0) {
        this.recvUsernames = new Array();
        for (let i = 0; i < recvUsernames.length; i++) {
          this.recvUsernames[i] = {value: recvUsernames[i], checked: false};
        }
      } else {
        let flag = true;
        for (let i = 0; i < recvUsernames.length; i++) {
          for (let j = 0; j < this.recvUsernames.length; j++) {
            if (recvUsernames[i] == this.recvUsernames[j].value) {
              flag = false;
              break;
            }
          }
          if (flag == true) {
            this.recvUsernames.push({value: recvUsernames[i], checked: false});
          }
        }
      }
    }
  }

  /**
   * 初始化筛选条件
   */
  private initData() {
    this.alertLevels = [{label: '通知级别', value: 3, checked: false}, {
      label: '警告级别',
      value: 2,
      checked: false
    }, {label: '严重级别', value: 1, checked: false}];
    this.faultStates = [
      {label: '已恢复', value: 3, checked: false},
      {label: '未恢复', value: 4, checked: false},
      {label: '已处理', value: 2, checked: false},
      {label: '已认领', value: 1, checked: false},
      {label: '未认领', value: 0, checked: false}];
    this.faultTypes = [
      {label: "网关故障", value: '网关', checked: false},
      {label: "通道故障", value: '通道', checked: false},
      {label: "透传故障", value: '透传', checked: false},
      {label: "系统故障", value: '系统', checked: false},
      {label: "数据库故障", value: '数据库', checked: false},
      {label: "其它故障", value: '其它', checked: false}];

    this.param = {
      startTime: this.formatDateTime(new Date()),
      faultState: 0
    }
    this.selectedFaultState = this.faultStates[4].label;
    this.faultStates[4].checked = true;
  }

  /**
   * 下拉刷新
   * @param refresher
   */
  doRefresh(refresher) {
    setTimeout(() => {
      this.getFaultTabele();
      refresher.complete();
    }, 2000);
  }

  /**
   * 重置筛选条i按
   */
  reset() {
    this.initItem("alertLevel");
    this.initItem("faultState");
    this.initItem("faultType");
    this.initItem("recvUsername");
    this.param.startTime = this.formatDateTime(new Date());
    this.param.endTime = null;
  }

  /**
   * 把数组对应元素初始化,背景色和param都设置为默认值
   * @param arr
   */
  private initItem(arr: string) {
    let tmpArr = this[arr + 's'];
    if (tmpArr != null) {
      for (let i = 0; i < tmpArr.length; i++) {
        let item = document.getElementById(arr + 's_' + tmpArr[i].value);
        item.style.backgroundColor = this.defaultColor;
      }
      this.param[arr] = this.defaultValue[arr];

    }
  }

  private  formatDateTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  };

}
