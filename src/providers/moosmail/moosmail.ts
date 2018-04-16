import {Injectable} from '@angular/core';
import {MoosClient} from "./MoosClient";
import {Storage} from "@ionic/storage";
import {Subject} from "rxjs/Subject";

@Injectable()
export class MoosmailProvider {
  public knownClients: Map<string, MoosClient> = new Map();
  public newClientEmitter = new Subject();
  public static pauseUpdates = false;
  public savedClients: {name, address}[] = [];

  constructor(private storage: Storage) {
    this.storage.get("prefs.shoresideAddress").then((value) => {
      if (value != "" && value != null) {
        this.discoverNewClient("shoreside", "ws://" + value + ":9090/listen");
      } else {
        // In case the app isn't configured, use a default value. Tune this to be the real MIT shoreside address
        this.discoverNewClient("shoreside", "ws://10.0.0.20:9090/listen");
      }
    });

    this.storage.get("rememberedClients").then((value => {
      if (value == null) return;
      this.savedClients = value;
      value.forEach((client => {
        this.discoverNewClient(client.name, client.address)
      }));
    }));
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

  rememberedClientIndex(client: MoosClient): number {
    return (this.savedClients.findIndex((value) => {
      return value.name == client.name && value.address == client.address;
    }));
  }

  rememberClient(client: MoosClient) {
    if (this.rememberedClientIndex(client) != -1) return;
    this.savedClients.push({name: client.name, address: client.address});
    this.storage.set("rememberedClients", this.savedClients);
  }

  forgetClient(client: MoosClient) {
    this.savedClients.splice(this.rememberedClientIndex(client), 1);
    this.storage.set("rememberedClients", this.savedClients);
  }

  /*
  Useful links for implementing points <=> coords
  https://github.com/moos-ivp/svn-mirror/blob/febd739ec9736543e74dc902d2d252db7cb0e8bb/ivp/data/datums.txt
  http://oceanai.mit.edu/aquaticus/pmwiki/pmwiki.php?n=Site.FieldCoords
   */
}

