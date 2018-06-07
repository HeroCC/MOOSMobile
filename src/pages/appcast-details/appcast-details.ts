import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AppCast} from "../../providers/moosmail/AppCast";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";

@Component({
  selector: 'page-appcast-details',
  templateUrl: 'appcast-details.html',
})
export class AppcastDetailsPage {
  proc: AppCast;
  timer;

  constructor(public navCtrl: NavController, public navParams: NavParams, public mm: MoosmailProvider) {
    this.proc = this.navParams.get("appcast");
  }

  ionViewWillEnter() {
    this.timer = window.setInterval(() => {
      this.mm.knownClients.get("shoreside").sendMessage("APPCAST_REQ",
        "node=" + this.proc.nodeName + ",app=" + this.proc.procName + ",duration=1.0,threshold=any,key=MOOSMOBILE_DETAILS")
    }, 1500);
  }

  ionViewWillLeave() {
    window.clearInterval(this.timer);
  }
}
