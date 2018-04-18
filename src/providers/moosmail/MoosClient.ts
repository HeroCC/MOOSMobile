import {Subject} from "rxjs/Subject";
import {MoosmailProvider} from "./moosmail";
import ReconnectingWebsocket from "reconnecting-websocket";

export class MoosClient {
  public readonly ws: ReconnectingWebsocket;
  public receivedMail: Map<string, MoosMail> = new Map();
  public mailEmitter = new Subject<MoosMail>();
  public savedMail: Set<string> = new Set();

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
      // All clients should subscribe to NODE_REPORTs by default (required for the map to work)
      this.subscribe("NODE_REPORT");
      this.savedMail.forEach((value => {
        this.subscribe(value);
      }));
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
    // Sanitize user input so they don't subscribe to mail named "BLA=SANITIZE", setting BLA to SANITIZE
    mail.name = name.split("=")[0];
    mail.content = "";
    mail.timestamp = 0;
    this.receivedMail.set(name, mail);
    this.ws.send(mail.name);
  }

  getSimplifiedClient() {
    return {name: this.name, address: this.address, savedMail: this.savedMail};
  }

  remember(mm: MoosmailProvider) {
    this.forget(mm);
    mm.savedClients.set(this.name, this.getSimplifiedClient());
    mm.resave();
  }

  forget(mm: MoosmailProvider) {
    mm.savedClients.delete(this.name);
    mm.resave();
  }

  isRemembered(mm: MoosmailProvider) {
    return mm.savedClients.has(this.name);
  }
}

export class MoosMail {
  public name: string;
  public content: string;
  public timestamp: number;
  public hiddenFromList: boolean = false; // Users can unhide by resubscribing under the client card
  public expandOnList: boolean = false;
}
