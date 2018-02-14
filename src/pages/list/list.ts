import {Component} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {MoosClient} from "../../providers/moosmail/MoosClient";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  clients: Map<MoosClient, Map<string, string>> = new Map();

  constructor(public navCtrl: NavController, private events: Events) {
    events.subscribe('moosmail:received', (varsMap: string, client: MoosClient, key: string) => {
      this.clients.get(client).set(key, varsMap);
      // TODO if a mail is a multipart thing, split it up
    });
  }

}
