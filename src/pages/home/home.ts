import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {BackgroundMode} from "@ionic-native/background-mode";
import {MediaObject,Media} from "@ionic-native/media";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

}
