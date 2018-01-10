import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {MorePage} from "../more/more";
import {NotificationPage} from "../notification/notification";
import {ChatPage} from "../chat/chat";

/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage = TabsPage;
  pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = [
      { title: 'Chat', component: ChatPage },
      { title: 'More', component: MorePage },
      { title: 'Notification', component: NotificationPage }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
