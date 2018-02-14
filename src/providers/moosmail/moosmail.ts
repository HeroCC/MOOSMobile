import {Injectable} from '@angular/core';
import {Events} from "ionic-angular";
import {MoosClient} from "./MoosClient";

@Injectable()
export class MoosmailProvider {
  public static events: Events; // Allow other classes to be able to use events without including it in constructor
  public static knownClients: Map<string, MoosClient> = new Map();

  constructor(public e: Events) {
    MoosmailProvider.events = e;
    MoosmailProvider.knownClients.set("shoreside", new MoosClient(new WebSocket("ws://10.0.0.20:9090/listen")));
    MoosmailProvider.knownClients.get("shoreside").name = "shoreside";
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

