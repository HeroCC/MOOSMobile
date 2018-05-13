import {Injectable} from '@angular/core';
import {MoosClient, MoosMail} from "./MoosClient";
import {Storage} from "@ionic/storage";
import {Subject} from "rxjs/Subject";

@Injectable()
export class MoosmailProvider {
  public knownClients: Map<string, MoosClient> = new Map();
  public newClientEmitter = new Subject<MoosClient>();
  public static pauseUpdates = false;

  constructor(private storage: Storage) {
    this.storage.get("rememberedClients").then((value => {
      value.forEach((recalledClient => {
        // Client properties are recalled here
        let cc = this.discoverNewClient(recalledClient.name, recalledClient.address);

        recalledClient.savedMail.forEach((j) => {
          // We can't use the subscribe()
          cc.receivedMail.set(j, new MoosMail());
        });

      }));

      if (!this.knownClients.has("shoreside")) {
        // In case the app isn't configured, use a default value
        this.discoverNewClient("shoreside", "ws://192.168.1.15:9090/listen");
      }
      this.resave();
    }));
  }

  discoverNewClient(name: string, address: string) {
    //if (this.knownClients.get(name) != null) client = this.knownClients.get(name);
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

  resave() {
    let savedClients = new Set();
    this.knownClients.forEach((value => {
      savedClients.add(value.getSimplifiedClient());
    }));
    this.storage.set("rememberedClients", savedClients);
  }

  /*
  Useful links for implementing points <=> coords
  https://github.com/moos-ivp/svn-mirror/blob/febd739ec9736543e74dc902d2d252db7cb0e8bb/ivp/data/datums.txt
  http://oceanai.mit.edu/aquaticus/pmwiki/pmwiki.php?n=Site.FieldCoords
   */
}

