import {Injectable} from '@angular/core';
import {MoosClient} from './MoosClient';
import {Storage} from '@ionic/storage';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MoosmailService {
  public savedClients: Map<string, {name, address, password, savedMail}> = new Map();
  public knownClients: Map<string, MoosClient> = new Map();
  public newClientEmitter = new BehaviorSubject<MoosClient>(null);
  public static pauseUpdates = false;

  constructor(private storage: Storage) {
    this.storage.get('rememberedClients').then((value => {
      if (value == null) return;
      JSON.parse(value).forEach((client => {
        // Client properties are recalled here
        let newClient = this.discoverNewClient(client.name, client.address, client.password);
        newClient.savedMail = new Set(client.savedMail);
        newClient.remember(this);
      }));
    }));
  }

  discoverNewClient(name: string, address: string, password?: string) {
    //if (this.knownClients.get(name) != null) return;
    let client = new MoosClient(name, address, password);
    this.knownClients.set(name, client);
    this.newClientEmitter.next(client);
    return client;
  }

  static parseString(value: string, chunkSep: string = ",", valSep: string = "="): Map<string, string> {
    const pairs = value.split(chunkSep);
    let thisVars: Map<string, string> = new Map();
    for (let i = 0; i < pairs.length; i++) {
      const key = pairs[i].split(valSep)[0];
      const value = pairs[i].slice(pairs[i].indexOf(valSep) + 1);
      thisVars.set(key, value);
    }
    return thisVars;
  }

  static getMapContentsAsArray(map: Map<any, any>, getKeys: boolean = false) {
    // Map.keys() & Map.values() exists, but when using in an *ngFor will throw an ExpressionChangedAfterItHasBeenCheckedError
    // See https://github.com/angular/angular/issues/2246
    let result = [];

    map.forEach((value, key) => {
      getKeys ? result.push(key) : result.push(value);
    });
    return result;
  }

  resave() {
    // Android / iOS devices can't store JS Objects, so stringify it before saving
    this.storage.set('rememberedClients', JSON.stringify(MoosmailService.getMapContentsAsArray(this.savedClients)));
  }

  /*
  Useful links for implementing points <=> coords
  https://github.com/moos-ivp/svn-mirror/blob/febd739ec9736543e74dc902d2d252db7cb0e8bb/ivp/data/datums.txt
  http://oceanai.mit.edu/aquaticus/pmwiki/pmwiki.php?n=Site.FieldCoords
  https://www.npmjs.com/package/proj4
   */
}
