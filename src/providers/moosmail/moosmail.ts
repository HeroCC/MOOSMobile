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
    this.storage.get("rememberedClients").then((value => {
      if (value == null) return;
      this.savedClients = value;
      value.forEach((client => {
        this.discoverNewClient(client.name, client.address)
      }));

      if (this.rememberedClientIndexByName("shoreside") == -1) {
        // In case the app isn't configured, use a default value
        this.rememberClient(this.discoverNewClient("shoreside", "ws://192.168.1.15:9090/listen"));
      }
    }));
  }

  discoverNewClient(name: string, address: string) {
    //if (this.knownClients.get(name) != null) return;
    let client = new MoosClient(name, address);
    this.knownClients.set(name, client);
    this.newClientEmitter.next(client);
    return client;
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

  rememberedClientIndexByName(clientName: string): number {
    return (this.savedClients.findIndex((value) => {
      return value.name == clientName;
    }));
  }

  rememberedClientIndex(client: MoosClient): number {
    return (this.savedClients.findIndex((value) => {
      return value.name == client.name && value.address == client.address;
    }));
  }

  rememberClient(client: MoosClient) {
    this.forgetClient(client);
    this.savedClients.push({name: client.name, address: client.address});
    this.storage.set("rememberedClients", this.savedClients);
  }

  forgetClient(client: MoosClient) {
    if (this.rememberedClientIndex(client) == -1) return;
    this.savedClients.splice(this.rememberedClientIndex(client), 1);
    this.storage.set("rememberedClients", this.savedClients);
  }

  /*
  Useful links for implementing points <=> coords
  https://github.com/moos-ivp/svn-mirror/blob/febd739ec9736543e74dc902d2d252db7cb0e8bb/ivp/data/datums.txt
  http://oceanai.mit.edu/aquaticus/pmwiki/pmwiki.php?n=Site.FieldCoords
   */
}

