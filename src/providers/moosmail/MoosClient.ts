import {MoosmailProvider} from "./moosmail";

export class MoosClient {
  private _name: string;
  public receivedMail: Map<string, string> = new Map();

  constructor(public ws: WebSocket) {
    this.ws.onmessage = (evt) => {
      const origString = evt.data;
      const key = origString.split("=")[0];
      const val = origString.slice(origString.indexOf("=") + 1);
      this.receivedMail.set(key, val);
      MoosmailProvider.events.publish('moosmail:received', val, this, key);
      MoosmailProvider.events.publish('moosmail:received:' + key, val, this, key);
    };

    this.ws.onopen = () => {
      this.ws.send("NODE_REPORT");
    }
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
