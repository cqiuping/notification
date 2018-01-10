import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaultPage } from './fault';

@NgModule({
  declarations: [
    FaultPage,
  ],
  imports: [
    IonicPageModule.forChild(FaultPage),
  ],
})
export class FaultPageModule {}
