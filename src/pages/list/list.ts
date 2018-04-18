import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {MoosClient} from "../../providers/moosmail/MoosClient";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  constructor(public navCtrl: NavController, public mm: MoosmailProvider, private alertCtrl: AlertController) {
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
          placeholder: 'Address:Port'
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
            if (this.mm.savedClients.has(data.name)) {
              alert("There is already a client saved with this name!");
              return false;
            }
            this.mm.discoverNewClient(data.name, "ws://" + data.address + "/listen");
            return true;
          }
        }
      ]
    });
    prompt.present();
  }
}
