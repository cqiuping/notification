import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, Platform} from 'ionic-angular';
import {MyApp} from './app.component';

import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ChatPage} from "../pages/chat/chat";
import {NotificationPage} from "../pages/notification/notification";
import {MorePage} from "../pages/more/more";
import {RestProvider} from '../providers/rest/rest';
import {LoginPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {UserPage} from "../pages/user/user";
import {Media, MediaObject} from "@ionic-native/media";
import {BackgroundMode} from "@ionic-native/background-mode";
import {AppMinimize} from "@ionic-native/app-minimize";
import {JPush} from "@jiguang-ionic/jpush";
import {IonicStorageModule} from "@ionic/storage";
import {HttpClientModule} from "@angular/common/http"
declare var enc ;

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatPage,
    NotificationPage,
    MorePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    UserPage,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatPage,
    NotificationPage,
    MorePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    UserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    Media,
    BackgroundMode,
    AppMinimize,
    JPush
  ]
})
export class AppModule {

  constructor(private media: Media,
              private backgroundMode: BackgroundMode,
              public platform: Platform,
              private appMinimize: AppMinimize,
              private rest:RestProvider) {
    backgroundMode.enable();
    backgroundMode.setDefaults(({
      title: '通知应用',
      text: '在后台运行'
    }));

    this.platform.registerBackButtonAction(() => {
      this.appMinimize.minimize();
    }, 100);


    // window['plugins'].jPushPlugin.init();
    // this.jPushAddEventListener();
    // this.backgroundMode.on('activate').subscribe(
    //   () => {
    //     // this.jPushAddEventListener();
    //     this.rest.getAlaram()
    //       .subscribe(
    //         f=>{
    //           console.log(f);
    //         }
    //       )
    //   }
    // )
  }

//先屏蔽，到时候看要不要推送
  // private jPushAddEventListener() {
  //   document.addEventListener("jpush.receiveNotification", event => {
  //     const file: MediaObject = this.media.create("/android_asset/www/assets/file/music.mp3");
  //     // file.onError.subscribe(error => this.info = error);
  //     file.play();
  //   }, false);
  // }

}
