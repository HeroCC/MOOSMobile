import {Subject} from "rxjs/Subject";
import {MoosmailProvider} from "./moosmail";

export class MoosClient {
  public ws: WebSocket;
  public receivedMail: Map<string, string> = new Map();
  public mailEmitter = new Subject<string>();

  constructor(public name: string, public address: string) {
    this.ws = new WebSocket(address);

    this.ws.addEventListener('message', (evt => {
      if (MoosmailProvider.pauseUpdates) return;
      const origString = evt.data;
      const key = origString.split("=")[0];
      const val = origString.slice(origString.indexOf("=") + 1);
      this.receivedMail.set(key, val);
      this.mailEmitter.next(key);
    }));

    this.ws.addEventListener('open', (evt => {
      this.ws.send("NODE_REPORT");
    }));
  }
}
