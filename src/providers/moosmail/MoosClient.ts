import {Subject} from "rxjs/Subject";
import {MoosmailProvider} from "./moosmail";

export class MoosClient {
  public receivedMail: Map<string, string> = new Map();
  public mailEmitter = new Subject<string>();

  constructor(public name: string, public ws: WebSocket) {
    this.ws.onmessage = (evt) => {
      if (MoosmailProvider.pauseUpdates) return;
      const origString = evt.data;
      const key = origString.split("=")[0];
      const val = origString.slice(origString.indexOf("=") + 1);
      this.receivedMail.set(key, val);
      this.mailEmitter.next(key);
    };

    this.ws.onopen = () => {
      this.ws.send("NODE_REPORT");
    }
  }
}
