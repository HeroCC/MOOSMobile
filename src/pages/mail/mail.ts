import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {MoosClient} from "../../providers/moosmail/MoosClient";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";
import {PhonegapLocalNotification} from "@ionic-native/phonegap-local-notification";

@Component({
  selector: 'page-list',
  templateUrl: 'mail.html'
})
export class MailPage {

  constructor(public navCtrl: NavController, public mm: MoosmailProvider, private alertCtrl: AlertController,
              public localNotification: PhonegapLocalNotification) {

  }

  getMapValuesAsArray(map: Map<any, any>) {
    // Angular webpages can't access static methods from other classes, so use this as a bridge to the real function
    return MoosmailProvider.getMapContentsAsArray(map);
  }

  editMailPrompt(client: MoosClient, mailName: string) {
    let alert = this.alertCtrl.create({
      title: 'Emit message to ' + mailName,
      inputs: [
        {
          name: 'message',
          placeholder: client.receivedMail.get(mailName).content
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            client.sendMessage(mailName, data.message);
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  subscribeToNewMailPrompt(client: MoosClient) {
    let alert = this.alertCtrl.create({
      title: 'Subscribe to new mail',
      inputs: [
        {
          name: 'mail',
          placeholder: 'Mail'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            if (client.receivedMail.get(data.mail) != null) {
              client.receivedMail.get(data.mail).hiddenFromList = false;
            }
            client.subscribe(data.mail);
            return true;
          }
        }
      ]
    });
    alert.present();
  }

  addNewClientPrompt() {
    // This will be here until the automatic discovery code is finished
    let prompt = this.alertCtrl.create({
      title: 'Listen for new client',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'address',
          placeholder: '192.168.1.20:9090'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            if (this.mm.savedClients.has(data.name.toLowerCase())) {
              alert("There is already a client saved with this name!");
              return false;
            } else if (!new RegExp('[0-9]+(?:\.[0-9]+){3}:[0-9]+').test(data.address)) {
              alert("The IP address / port you entered doesn't look valid. Continuing with your input, but please review to ensure you didn't mistype");
            }
            this.mm.discoverNewClient(data.name.toLowerCase(), "ws://" + data.address + "/listen");
            return true;
          }
        }
      ]
    });
    prompt.present();
  }
}
