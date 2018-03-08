import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, ToastController} from 'ionic-angular';
import {BackgroundMode} from "@ionic-native/background-mode";
import {MediaObject, Media} from "@ionic-native/media";
import {RestProvider} from "../../providers/rest/rest";
import {BaseUI} from "../../common/baseui";
import {FaultOrderPage} from "../fault-order/fault-order";
declare var echarts;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BaseUI {

  chartContainer;
  isLine: boolean = true;
  timeRegion: string;

  topAlarms: any;
  unhandle: number;
  file:MediaObject ;
  ws: any;
  /** webSocket连接标识**/
  wsBaseUrl = 'ws://172.16.22.248:8080/mobile/websocket/ws';

  constructor(public navCtrl: NavController,
              private rest: RestProvider,
              private media: Media,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private backgroundMode: BackgroundMode) {
    super();
  }

  /**
   * 页面进入之后执行，并且每次进入都会执行
   */
  ionViewDidEnter() {
    this.getAlarm();
    this.loadChat();
    this.refresh();
    this.backgroundMode.on('activate').subscribe(
        () => {
          this.refresh();
        }
    )

  }

  /**
   * 页面加载完毕执行，并且只执行一次
   */
  ionViewDidLoad() {
    // const file: MediaObject = this.media.create("/android_asset/www/assets/file/music.mp3");
    this.file = this.media.create("/android_asset/www/assets/file/music.mp3");
    this.conWebSocket();
  }


  /**
   * 连接webSocket
   */
  conWebSocket() {
    if ('WebSocket' in window) {
      this.ws = new WebSocket(this.wsBaseUrl);
    }
  }

  /**
   * 检查webSocket状态，如果未连接就重新连接，如果已连接就监听消息
   */
  checkWebSocket() {
    if ('WebSocket' in window) {
      this.ws.onopen = function () {
        console.log('websocket open');
      };
      var that = this;
      this.ws.onmessage = function (event) {
        that.playMusic(that.file);
      }
      this.ws.onClose = function () {
        console.log("connection closed");
        that.ws = new WebSocket(this.wsBaseUrl);
      }
      if (this.ws.readyState == WebSocket.CLOSED) {
        that.ws = new WebSocket(this.wsBaseUrl);
      }
    } else {
      alert("not support websocket");
    }
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
  private refresh() {
    setInterval(() => {
      this.checkWebSocket();
    }, 5000)
  }

  /**
   * 跳转页面
   */
  showFaultModal() {
    // this.modalCtrl.create(FaultPage).present();
    this.navCtrl.push(FaultOrderPage);
  }

  /**
   * 获取sys_event数据
   */
  private getAlarm() {
    this.rest.getAlaram()
    .subscribe(res => {
      this.topAlarms = res["data"]["topAlarms"];
      this.unhandle = res["data"]["unhandle"];
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


  private clickHost() {
    this.rest.statisticsHostPie().subscribe(
        res => {
          const hostChart = echarts.init(this.chartContainer);
          hostChart.setOption(this.newPieStatOpt("主机监控"));
          let hostData = this.newPieArray(res["data"]);
          hostChart.setOption(this.newPieDataOpt(hostData));
          this.chartContainer.removeAttribute("_echarts_instance_");
        }, error => {
          console.log("clickHost error:" + error.messge);
        }
    )
  }

  private clickApp() {
    this.rest.statisticsAppPie().subscribe(
        res => {
          const appChart = echarts.init(this.chartContainer);
          appChart.setOption(this.newPieStatOpt("应用监控"));
          let appData = this.newPieArray(res["data"]);
          appChart.setOption(this.newPieDataOpt(appData));
          this.chartContainer.removeAttribute("_echarts_instance_");
        }, error => {
          console.log("clickApp error" + error.message);
        }
    )
  }

  private clickNode() {
    this.rest.statisticsNodePie().subscribe(
        res => {
          const nodeChart = echarts.init(this.chartContainer);
          nodeChart.setOption(this.newPieStatOpt("节点监控"));
          let nodeData = this.newPieArray(res["data"]);
          nodeChart.setOption(this.newPieDataOpt(nodeData));
          this.chartContainer.removeAttribute("_echarts_instance_");
        },
        error => {
          console.log("clickNode error:" + error.message);
        }
    )
  }

  clickAlarmLine(timeRegion) {
    this.timeRegion = timeRegion;
    this.rest.statisticsAlarmLineTrend(timeRegion).subscribe(
        res => {
          console.log(res["data"]);
          const alarmLineChart = echarts.init(this.chartContainer);
          alarmLineChart.setOption(this.newLineStatOpt("告警趋势"));
          alarmLineChart.setOption(this.newLineDataOpt(res["data"]));
          this.chartContainer.removeAttribute("_echarts_instance_");

        }, err => {
          console.log("clickAlarmLine error:" + err.message);
        }
    )
  }

  segmentChanged(e) {
    if (e.value == "host") {
      this.isLine = true;
      this.clickHost();
    } else if (e.value == "app") {
      this.isLine = true;
      this.clickApp();
    } else if (e.value == "node") {
      this.isLine = true;
      this.clickNode();
    } else if (e.value == "nodeAlarm") {
      this.isLine = false;
      this.clickAlarmLine('D');
    }
  }

  /**
   * 图形chat初始化
   */
  private loadChat() {
    this.chartContainer = document.getElementById('chartContainer');
    this.clickHost();
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

  /**
   * 折线图数据赋值
   */
  private newLineDataOpt(data) {
    return {
      xAxis: {
        data: data.time
      },
      series: [{
        data: data.count
      }]
    }
  }

  /**
   * 环形图data构造
   */
  private newPieArray(obj) {
    var result = [];
    console.log(obj);
    result[0] = 'inline' in obj ? obj.inline : 0;
    result[1] = 'resuming' in obj ? obj.resuming : 0;
    result[2] = 'tholdalarm' in obj ? obj.tholdalarm : 0;
    result[3] = 'downtime' in obj ? obj.downtime : 0;
    return result;
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

}
