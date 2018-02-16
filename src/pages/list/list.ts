import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {MoosClient} from "../../providers/moosmail/MoosClient";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  clients: MoosClient[] = [];

  constructor(public navCtrl: NavController, public mm: MoosmailProvider) {
    this.mm.knownClients.forEach((value, key) => {
      this.clients.push(value);
    });
  }
}
