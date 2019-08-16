import { Component } from '@angular/core';
import {MoosmailService} from '../services/moosmail/moosmail.service';
import {AlertController} from '@ionic/angular';
import {MoosClient} from '../services/moosmail/MoosClient';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-mail',
  templateUrl: 'mail.page.html',
  styleUrls: ['mail.page.scss']
})
export class MailPage {
  constructor(private mm: MoosmailService, private alertCtrl: AlertController, public localNotification: LocalNotifications) {

  }

  getMapValuesAsArray(map: Map<any, any>) {
    // Angular webpages can't access static methods from other classes, so use this as a bridge to the real function
    return MoosmailService.getMapContentsAsArray(map);
  }

  editMailPrompt(client: MoosClient, mailName: string) {
    this.alertCtrl.create({
      message: 'Emit message to ' + mailName,
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
    }).then(alert => alert.present());
  }

  subscribeToNewMailPrompt(client: MoosClient) {
    this.alertCtrl.create({
      message: 'Subscribe to new mail',
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
    }).then(alert => alert.present());
  }

  addNewClientPrompt() {
    // This will be here until the automatic discovery code is finished
    this.alertCtrl.create({
      message: 'Listen for new client',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
        {
          name: 'address',
          placeholder: 'Address (192.168.1.20)',
        },
        {
          name: 'port',
          placeholder: 'Port (9090)',
          value: 9090,
          type: 'number'
        },
        {
          name: 'password',
          placeholder: 'Password (Optional)',
          type: 'password'
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
              alert("The IP address / port you entered doesn't look valid. Continuing, but please review to ensure you didn't mistype");
            }
            this.mm.discoverNewClient(data.name.toLowerCase(), "ws://" + data.address + ":" + data.port + "/listen", data.password);
            return true;
          }
        }
      ]
    }).then(prompt => prompt.present());
  }

}
