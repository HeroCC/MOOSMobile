import {Subject} from "rxjs/Subject";
import {PhonegapLocalNotification} from '@ionic-native/phonegap-local-notification';
import {MoosmailProvider} from "./moosmail";
import ReconnectingWebsocket from "reconnecting-websocket";

export class MoosClient {
  public readonly ws: ReconnectingWebsocket;
  public receivedMail: Map<string, MoosMail> = new Map();
  public mailEmitter = new Subject<MoosMail>();
  public savedMail: Set<string> = new Set();

  constructor(public name: string, public address: string, private password?: string) {
    let localNotification: PhonegapLocalNotification = new PhonegapLocalNotification();
    this.ws = new ReconnectingWebsocket(address); // See https://github.com/joewalnes/reconnecting-websocket
    this.ws.reconnectInterval = 3000; // 3 Seconds
    this.ws.maxReconnectInterval = 5000; // 10 Seconds

    this.ws.addEventListener('message', (evt => {
      if (MoosmailProvider.pauseUpdates) return;
      const origString = evt.data;
      const name = origString.split("=")[0];

      let mail = this.receivedMail.get(name) || new MoosMail();
      mail.name = name;
      mail.content = origString.slice(origString.indexOf("=") + 1);
      mail.timestamp = Date.now();
      mail.hiddenFromList = mail.name.startsWith("$");
      if (mail.notifyOnUpdate){
        localNotification.create(mail.name + " has changed", {
          body: "Now set to " + mail.content,
          tag: "mailUpdate"
        });
      }
      this.receivedMail.set(mail.name, mail);
      this.mailEmitter.next(mail);
    }));

    this.ws.addEventListener('open', (evt => {
      this.sendInternalMessage("SetPassword", this.password);
      this.savedMail.forEach((value => {
        this.subscribe(value);
      }));
    }));
  }

  sendMessage(name: string, content: string) {
    let mail = this.receivedMail.get(name) || new MoosMail();
    mail.name = name;
    mail.content = content;
    this.receivedMail.set(name, mail); // In case the message doesn't loop back with an update
    if (this.ws.readyState == 1) {
      this.ws.send(name + "=" + content);
    } else {
      this.ws.addEventListener('open', (evt => {
        this.ws.send(name + "=" + content);
      }));
    }
  }

  sendInternalMessage(name: string, content: string) {
    const reservedChar = "$";

    if (this.ws.readyState == 1) {
      this.ws.send(reservedChar + name + "=" + content);
    } else {
      this.ws.addEventListener('open', (evt => {
        this.ws.send(reservedChar + name + "=" + content);
      }));
    }
  }

  subscribe(name: string) {
    let mail = new MoosMail();
    // Sanitize user input so they don't subscribe to mail named "BLA=SANITIZE", setting BLA to SANITIZE
    mail.name = name.split("=")[0];
    mail.content = "";
    mail.timestamp = 0;
    this.receivedMail.set(name, mail);
    if (this.ws.readyState == 1) {
      // If we attempt to send a message when the socket isn't connected, it will fail end error
      // However, it is added to receivedMail, and will be subscribed to when it becomes available
      this.ws.send(mail.name);
    } else {
      this.ws.addEventListener('open', (evt => {
        this.ws.send(mail.name);
      }));
    }
  }

  getSimplifiedClient() {
    return {name: this.name, address: this.address, password: this.password, savedMail: Array.from(this.savedMail)};
  }

  remember(mm: MoosmailProvider) {
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
  public notifyOnUpdate: boolean = false;
}
