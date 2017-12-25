import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {BackgroundMode} from "@ionic-native/background-mode";
import {MediaObject,Media} from "@ionic-native/media";
import {RestProvider} from "../../providers/rest/rest";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private rest:RestProvider) {
    // this.rest.getAlaram()
    //   .subscribe(
    //     f=>{
    //       console.log(f);
    //     }
    //   )
  }

}
