import { Component } from '@angular/core';
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
  private rootPage;
  private homePage;
  private catsPage;
  private dogsPage;


  constructor(public navCtrl: NavController,
              private viewCtrl:ViewController,
              private menu:MenuController,
              public navParams: NavParams) {
  }


}
