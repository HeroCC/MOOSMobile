import {Injectable} from '@angular/core';
import {MoosClient} from "./MoosClient";
import {Storage} from "@ionic/storage";
import {Subject} from "rxjs/Subject";

@Injectable()
export class MoosmailProvider {
  public knownClients: Map<string, MoosClient> = new Map();
  public newClientEmitter = new Subject();
  public static pauseUpdates = false;

  constructor(private storage: Storage) {
    this.storage.get("prefs.shoresideAddress").then((value) => {
      if (value != "" && value != null) {
        this.discoverNewClient("shoreside", "ws://" + value + ":9090/listen");
      } else {
        // In case the app isn't configured, use a default value. Tune this to be the
        this.discoverNewClient("shoreside", "ws://10.0.0.20:9090/listen");
      }
    });
  }

  discoverNewClient(name: string, address: string) {
    if (this.knownClients.get(name) != null) return;
    let client = new MoosClient(name, address);
    this.knownClients.set(name, client);
    this.newClientEmitter.next(client);
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

