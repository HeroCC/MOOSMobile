import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {MoosClient} from "../../providers/moosmail/MoosClient";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  clients: MoosClient[] = [];

  constructor(public navCtrl: NavController, public mm: MoosmailProvider, private alertCtrl: AlertController) {
    this.mm.knownClients.forEach((value, key) => {
      this.clients.push(value);
    });

    this.mm.newClientEmitter.subscribe((newClient: MoosClient) => {
      this.clients.push(newClient);
    });
  }

  getMapValuesAsArray(map: Map<any, any>) {
    // Map.keys() & Map.values() exists, but when using in an *ngFor will throw an ExpressionChangedAfterItHasBeenCheckedError
    // See https://github.com/angular/angular/issues/2246
    let result = [];

    map.forEach((value, key) => {
      result.push(value);
    });
    return result;
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
            client.subscribe(data.mail);
            return true;
          }
        }
      ]
    });
    alert.present();
  }
}
