import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {MoosmailProvider} from "../../providers/moosmail/moosmail";
import {MoosMail} from "../../providers/moosmail/MoosClient";
import {AppCast} from "../../providers/moosmail/AppCast";

@Component({
  selector: 'page-appcast',
  templateUrl: 'appcast.html',
})
export class AppcastPage {
  appcastContainer: Map<string, Map<string, AppCast>> = new Map();

  constructor(public navCtrl: NavController, public navParams: NavParams, public mm: MoosmailProvider,
              public toast: ToastController, public modal: ModalController) {

  }

  getMapContentsAsArray(map: Map<any, any>, getKeys: boolean = false) {
    // Angular webpages can't access static methods from other classes, so use this as a bridge to the real function
    return MoosmailProvider.getMapContentsAsArray(map, getKeys);
  }

  ionViewDidLoad() {
    let client = this.mm.knownClients.get("shoreside");
    if (client.name.toLocaleLowerCase() != "shoreside"){
      this.toast.create({
        message: "A client named 'shoreside' is required for AppCasts to function, but none was found",
        duration: 5000,
        dismissOnPageChange: true,
      });
      return;
    }
    client.subscribe("APPCAST");
    client.subscribe("APPCAST_REQ");
    client.sendMessage("APPCAST_REQ", "node=any,app=any,duration=10.0,threshold=any,key=WEBSOCKET_ID_HERE");
    client.mailEmitter.subscribe((mail: MoosMail) => {
      if (mail.name == "APPCAST"){
        let parsedCast: AppCast = AppCast.stringToAppCast(mail.content);

        if (this.appcastContainer.get(parsedCast.nodeName) == null)
          this.appcastContainer.set(parsedCast.nodeName, new Map()); // This usually shouldn't happen, as it is handled by the DB_CLIENT mail. However, keep is here just in case

        this.appcastContainer.get(parsedCast.nodeName).set(parsedCast.procName, parsedCast);
      }
    });
  }
}
