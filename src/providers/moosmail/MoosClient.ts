import {Subject} from "rxjs/Subject";
import {MoosmailProvider} from "./moosmail";
import ReconnectingWebsocket from "reconnecting-websocket";

export class MoosClient {
  public readonly ws: ReconnectingWebsocket;
  public receivedMail: Map<string, MoosMail> = new Map();
  public mailEmitter = new Subject<MoosMail>();

  constructor(public name: string, public address: string) {
    this.ws = new ReconnectingWebsocket(address); // See https://github.com/joewalnes/reconnecting-websocket
    this.ws.reconnectInterval = 3000; // 3 Seconds
    this.ws.maxReconnectInterval = 10000; // 10 Seconds

    this.ws.addEventListener('message', (evt => {
      if (MoosmailProvider.pauseUpdates) return;
      const origString = evt.data;
      const name = origString.split("=")[0];

      let mail = new MoosMail();
      if (this.receivedMail.get(name) != null) mail = this.receivedMail.get(name);
      mail.name = name;
      mail.content = origString.slice(origString.indexOf("=") + 1);
      mail.timestamp = Date.now();
      if (mail.hiddenFromList == null) mail.hiddenFromList = false;
      this.receivedMail.set(mail.name, mail);
      this.mailEmitter.next(mail);
    }));

    this.ws.addEventListener('open', (evt => {
      this.ws.send("NODE_REPORT");
    }));
  }

  sendMessage(name: string, content: string) {
    let mail = new MoosMail();
    mail.name = name;
    mail.content = content;
    this.receivedMail.set(name, mail); // In case the message doesn't loop back with an update
    this.ws.send(name); // If it isn't already, subscribe
    this.ws.send(name + "=" + content); // Send the update
  }

  subscribe(name: string) {
    let mail = new MoosMail();
    mail.name = name;
    mail.content = "";
    mail.timestamp = 0;
    this.receivedMail.set(name, mail);
    this.ws.send(name);
  }
}

export class MoosMail {
  public name: string;
  public content: string;
  public timestamp: number;
  public hiddenFromList: boolean = false; // Users can unhide by resubscribing under the client card
}
