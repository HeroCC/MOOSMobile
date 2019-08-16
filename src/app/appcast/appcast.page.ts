import { Component } from '@angular/core';
import {AppCast} from '../services/moosmail/AppCast';
import {MoosmailService} from '../services/moosmail/moosmail.service';
import {ToastController} from '@ionic/angular';
import {MoosMail} from '../services/moosmail/MoosClient';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'appcast.page.html',
  styleUrls: ['appcast.page.scss']
})
export class AppcastPage {
  masterNode: string = "shoreside";
  appcastContainer: Map<string, Map<string, AppCast>> = new Map();
  previousDbClient: string = ""; // So that we don't hammer the masterNode with APPCAST_REQs for apps that don't cast

  constructor(private router: Router, private mm: MoosmailService, private toast: ToastController) {

  }

  getMapContentsAsArray(map: Map<any, any>, getKeys: boolean = false) {
    // Angular webpages can't access static methods from other classes, so use this as a bridge to the real function
    return MoosmailService.getMapContentsAsArray(map, getKeys);
  }

  openAppcastDetailsPage(appcast: AppCast) {
    this.router.navigate(["/tabs/appcast/appcast-details/"], {state: {proc: appcast}});

    /*
    this.navCtrl.push(AppcastDetailsPage, {
      appcast: appcast,
    });*/
  }

  ionViewDidEnter() {
    let client = this.mm.knownClients.get(this.masterNode);
    if (client == null) {
      this.toast.create({
        message: "A client named '" + this.masterNode + "' is required for AppCasts to function, but none was found",
        duration: 4000,
        position: 'top',
      }).then(toast => toast.present());
      return;
    }

    if (this.appcastContainer.get(this.masterNode) == null) this.appcastContainer.set(this.masterNode, new Map());
    client.subscribe("APPCAST_REQ");
    client.sendMessage("APPCAST_REQ", "node=any,app=any,duration=3.0,threshold=any,key=MOOSMOBILE_CATCHALL");
    client.sendMessage("APPCAST_REQ", "node=*,app=*,duration=3.0,threshold=any,key=MOOSMOBILE_CATCHALL");

    client.subscribe("DB_CLIENTS");
    client.subscribe("APPCAST");
    client.mailEmitter.subscribe((mail: MoosMail) => {
      if (mail.name == "APPCAST") {
        let parsedCast: AppCast = AppCast.stringToAppCast(mail.content);

        if (this.appcastContainer.get(parsedCast.nodeName) == null)
          this.appcastContainer.set(parsedCast.nodeName, new Map());

        if (this.appcastContainer.get(parsedCast.nodeName).get(parsedCast.procName) == null)
          this.appcastContainer.get(parsedCast.nodeName).set(parsedCast.procName, new AppCast());

        Object.assign(this.appcastContainer.get(parsedCast.nodeName).get(parsedCast.procName), parsedCast);
      } else if (mail.name == "DB_CLIENTS" && mail.content != this.previousDbClient) {
        this.previousDbClient = mail.content;
        // So that we can build the initial list of clients
        // Some may not actually be AppCasting apps, but we don't have a list of all nodes / appcast apps so this will do for now
        for (let clientName of mail.content.split(",")) {
          if (clientName == null || clientName == "") break;
          if (this.appcastContainer.get(this.masterNode).get(clientName) == null) {
            client.sendMessage("APPCAST_REQ", "node=" + this.masterNode +",app=" + clientName + ",duration=1.0,threshold=any,key=MOOSMOBILE_DISCOVER");
          }
        }
      }
    });
  }
}
