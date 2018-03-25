import {Subject} from "rxjs/Subject";
import {MoosmailProvider} from "./moosmail";

export class MoosClient {
  public ws: WebSocket;
  public receivedMail: Map<string, MoosMail> = new Map();
  public mailEmitter = new Subject<MoosMail>();

  constructor(public name: string, public address: string) {
    this.ws = new WebSocket(address);

    this.ws.addEventListener('message', (evt => {
      if (MoosmailProvider.pauseUpdates) return;
      let mail = new MoosMail();
      const origString = evt.data;
      mail.name = origString.split("=")[0];
      mail.content = origString.slice(origString.indexOf("=") + 1);
      this.receivedMail.set(mail.name, mail);
      this.mailEmitter.next(mail);
    }));

    this.ws.addEventListener('open', (evt => {
      this.ws.send("NODE_REPORT");
    }));
  }
}

export class MoosMail {
  public name: string;
  public content: string;
}
