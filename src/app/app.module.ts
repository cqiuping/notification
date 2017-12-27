import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, Platform, ToastController} from 'ionic-angular';
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
import {HTTP_INTERCEPTORS, HttpClientModule, HttpErrorResponse} from "@angular/common/http"
import {AuthInterceptorProvider} from '../providers/auth-interceptor/auth-interceptor';
import {Observable} from "rxjs/Observable";
import {BaseUI} from "../common/baseui";
import {NativeAudio} from "@ionic-native/native-audio";
import { RespInterceptorProvider } from '../providers/resp-interceptor/resp-interceptor';
declare var enc;

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
    NativeAudio,
    BackgroundMode,
    AppMinimize,
    JPush,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorProvider,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: RespInterceptorProvider,
    //   multi: true
    // },
    RespInterceptorProvider
  ]
})
export class AppModule extends BaseUI {

  timer: any;

  constructor(
              private backgroundMode: BackgroundMode,
              public platform: Platform,
              private appMinimize: AppMinimize) {
    super();
    backgroundMode.enable();
    backgroundMode.setDefaults(({
      title: '通知应用',
      text: '在后台运行'
    }));

    this.platform.registerBackButtonAction(() => {
      this.appMinimize.minimize();
    }, 100);
  }
}
