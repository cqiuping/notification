import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from 'ionic-angular';
import {BackgroundMode} from "@ionic-native/background-mode";
import {MediaObject, Media} from "@ionic-native/media";
import {RestProvider} from "../../providers/rest/rest";
import {BaseUI} from "../../common/baseui";
import {FaultPage} from "../fault/fault";
// import {LocalNotifications} from "@ionic-native/local-notifications";
declare var echarts;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseUI {

  @ViewChild('host') host: ElementRef;
  @ViewChild('app') app: ElementRef;
  @ViewChild('node') node: ElementRef;
  @ViewChild('nodeAlarm') nodeAlarm: ElementRef;
  chartContainer;

  hostPie: any;
  appPie: any;
  nodePie: any;
  nodeAlarmLine: any;

  topAlarms: any;
  unhandle: number;
  file: MediaObject;
  ws: any;
  /** webSocket连接标识**/
  wsBaseUrl = 'ws://172.16.22.176:7083';

  constructor(public navCtrl: NavController,
              private rest: RestProvider,
              private media: Media,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              // private localNotifications:LocalNotifications,
              private backgroundMode: BackgroundMode) {
    super();
  }

  /**
   * 页面进入之后执行，并且每次进入都会执行
   */
  ionViewDidEnter() {
    this.getAlarm();
    this.loadChat();
    // this.getNodeStaticsNodePie();
    this.refresh();
    // this.poll();
    this.backgroundMode.on('activate').subscribe(
      () => {
        // this.poll();
        this.refresh();
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
      this.ws = new WebSocket(this.wsBaseUrl + '/ams/webSocket');
    }
  }

  /**
   * 检查webSocket状态，如果未连接就重新连接，如果已连接就监听消息
   */
  checkWebSocket() {
    if ('WebSocket' in window) {
      this.ws.onopen = function () {
        console.log('webSocket open');
      };
      this.ws.onmessage = function (event) {
        this.playMusic(this.file);
      }
      this.ws.onClose = function () {
        console.log("connection closed");
        this.ws = new WebSocket(this.wsBaseUrl + '/ams/webSocket');
      }
      if (this.ws.readyState == WebSocket.CLOSED) {
        this.ws = new WebSocket(this.wsBaseUrl + '/ams/webSocket');
      }
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
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getAlarm();
      refresher.complete();
    }, 2000);
  }

  /**
   * 每5秒刷新
   */
  private refresh(){
    setInterval(()=>{
      this.checkWebSocket();
    },5000)
  }

  /**
   * 跳转页面
   */
  showFaultModal() {
    this.modalCtrl.create(FaultPage).present();
  }

  // /**
  //  * 请求获取监控环形图数据
  //  */
  // private getNodeStaticsNodePie() {
  //   this.rest.getStaticsNodePie().subscribe(
  //     res => {
  //       let hostData = this.newPieArray(res["responseParams"]["hostData"]);
  //       console.log(hostData);
  //       if(this.hostPie != null){
  //         this.hostPie.setOption(this.newPieDataOpt(hostData));
  //         // console.log(JSON.stringify(this.hostPie.getOption()));
  //       }
  //       let appData = this.newPieArray(res["responseParams"]["appData"]);
  //       if(this.appPie != null){
  //         this.appPie.setOption(this.newPieDataOpt(appData));
  //       }
  //       let nodeData = this.newPieArray(res["responseParams"]["nodeData"]);
  //       if(this.nodePie != null){
  //         this.nodePie.setOption(this.newPieDataOpt(nodeData));
  //       }
  //     },
  //     error => {
  //       console.log(error.message);
  //     }
  //   )
  // }

  /**
   * 获取sys_event数据
   */
  private getAlarm() {
    this.rest.getAlaram()
    .subscribe(res => {
      this.topAlarms = res["responseParams"]["topAlarms"];
      this.unhandle = res["responseParams"]["unhandle"];
      console.log(this.topAlarms);
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

  /**
   * 环形图option
   */
  private newPieStatOpt(name) {
    return {
      animation: true,
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        top: 'middle',
        left: '5%',
        formatter: '{name}',
        // textStyle: {
        //   color: '#fff',
        // },
        data: ['正常', '正在恢复', '阈值告警', '宕机']
      },
      color: ['#34c9ab', '#59b4f8', '#eac449', '#f656d6'],
      //color:['#9F85FF',  '#1BA8DD', '#037AE2','#3D4049'],
      series: [
        {
          name: name,
          type: 'pie',
          radius: ['45%', '65%'],
          center: ['70%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: []
        }
      ]
    };
  }

  /**
   * 折线图option
   */
  private newLineStatOpt(name) {
    return {
      animation: true,
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {show: false},
        data: []
      },
      yAxis: {
        type: 'value',
        splitLine: {show: false},
        boundaryGap: false
      },
      dataZoom: [{
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 60,
        end: 100
      },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 60,
          end: 100
        }],
      series: [
        {
          name: '告警数',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgba(46, 103, 181,0.2)'
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(46, 103, 181)'
              }, {
                offset: 1,
                color: 'rgb(81, 75, 116)'
              }])
            }
          },
          data: []
        }
      ]
    };
  }

  /**
   * 环形图data构造
   */
  private newPieArray(obj) {
    var result = [];
    result[0] = 'inline' in obj ? obj.inline : 0;
    result[1] = 'resuming' in obj ? obj.resuming : 0;
    result[2] = 'tholdalarm' in obj ? obj.tholdalarm : 0;
    result[3] = 'downtime' in obj ? obj.downtime : 0;
    return result;
  }

  /**
   *环形图数据赋值
   */
  private newPieDataOpt(vals) {
    return {
      series: [
        {
          data: [
            {value: vals[0], name: '正常'},
            {value: vals[1], name: '正在恢复'},
            {value: vals[2], name: '阈值告警'},
            {value: vals[3], name: '宕机'}
          ]
        }
      ]
    };
  }

  private clickHost(){
    this.rest.statisticsHostPie().subscribe(
      res=>{
        const hostChart = echarts.init(this.chartContainer);
        hostChart.setOption(this.newPieStatOpt("主机监控"));
        let hostData = this.newPieArray(res["responseParams"]);
        hostChart.setOption(this.newPieDataOpt(hostData));
        this.chartContainer.removeAttribute("_echarts_instance_");
      }
    )
  }

  private clickApp(){
    this.rest.statisticsAppPie().subscribe(
      res=>{
        const appChart = echarts.init(this.chartContainer);
        appChart.setOption(this.newPieStatOpt("应用监控"));
        let appData = this.newPieArray(res["responseParams"]);
        appChart.setOption(this.newPieDataOpt(appData));
        this.chartContainer.removeAttribute("_echarts_instance_");
      }
    )
  }

  private clickNode(){
    this.rest.statisticsNodePie().subscribe(
      res=>{
        const nodeChart = echarts.init(this.chartContainer);
        nodeChart.setOption(this.newPieStatOpt("节点监控"));
        let nodeData = this.newPieArray(res["responseParams"]);
        nodeChart.setOption(this.newPieDataOpt(nodeData));
        this.chartContainer.removeAttribute("_echarts_instance_");
      }
    )
  }

  segmentChanged(e) {
    if (e.value == "host") {
      this.clickHost();
    } else if (e.value == "app") {
      this.clickApp();
    } else if (e.value == "node") {
      this.clickNode();
    } else if (e.value == "nodeAlarm") {
      // this.clickChart4();
    }
  }
  /**
   * 图形chat初始化
   */
  private loadChat(){
    this.chartContainer = document.getElementById('chartContainer');
    this.clickHost();
  }
  // private loadChat() {
  //   if(this.host != null && this.hostPie == null){
  //     console.log(this.host);
  //     this.hostPie = echarts.init(this.host.nativeElement);
  //     this.hostPie.setOption(this.newPieStatOpt("主机监控"));
  //   }
  //   if(this.app != null && this.appPie == null){
  //     this.appPie = echarts.init(this.app.nativeElement);
  //     this.appPie.setOption(this.newPieStatOpt("应用监控"));
  //   }
  //   if(this.node != null && this.nodePie == null){
  //     this.nodePie = echarts.init(this.node.nativeElement);
  //     this.nodePie.setOption(this.newPieStatOpt("节点监控"));
  //   }
  //   if(this.nodeAlarm != null && this.nodeAlarmLine == null){
  //     this.nodeAlarmLine = echarts.init(this.nodeAlarm.nativeElement);
  //     this.nodeAlarmLine.setOption(this.newLineStatOpt("告警趋势"));
  //   }
  // }


  // refreshAlarmLine (timeRegion) {
  //   repo.getByPath(conf,"?action=alarmTrend&timeRegion="+timeRegion).then(function(data){
  //     if(data.status==0){
  //       nodeAlarmLine.setOption($scope.newLineDataOpt(data.data));
  //     }else{
  //       //toastr.error(data.errorMsg);
  //     }
  //   });
  //   $scope.timeRegion = timeRegion;
  // }


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
