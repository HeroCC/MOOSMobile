import {Injectable} from '@angular/core';
import {MoosClient} from "./MoosClient";
import {Subject} from "rxjs/Subject";

@Injectable()
export class MoosmailProvider {
  public knownClients: Map<string, MoosClient> = new Map();
  public newClientEmitter = new Subject();
  public static pauseUpdates = false;

  constructor() {
    this.discoverNewClient("shoreside", "ws://10.0.0.20:9090/listen");
  }

  discoverNewClient(name: string, address: string) {
    if (this.knownClients.get(name) != null) return;
    this.knownClients.set(name, new MoosClient(name, new WebSocket(address)));
    this.newClientEmitter.next(this.knownClients.get(name));
  }

  static processMailString(value): Map<string, string> {
      const pairs = value.split(",");
      let thisVars: Map<string, string> = new Map();
      for (let i = 0; i < pairs.length; i++) {
        const key = pairs[i].split("=")[0];
        value = pairs[i].split("=")[1];
        thisVars.set(key, value);
      }
      return thisVars;
  }
}

