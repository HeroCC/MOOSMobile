import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {LatLng, Marker} from "@ionic-native/google-maps";
import {MapPage} from "../../pages/map/map";
import {TabsPage} from "../../pages/tabs/tabs";
import {Events} from "ionic-angular";

@Injectable()
export class MoosmailProvider {
  //public ws: WebSocket = new WebSocket("ws://10.0.0.20:9090/listen");

  public static nodeReports: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();

  constructor(public events: Events) {
    let ws: WebSocket = new WebSocket("ws://10.0.0.20:9090/listen");
    ws.onmessage = (evt) => {
      const origString = evt.data;
      const key = origString.split("=")[0];
      const val = origString.slice(origString.indexOf("=") + 1);
      if (key == 'NODE_REPORT') {
        let thisVars: Map<string, string> = MoosmailProvider.processMailString(val);
        MoosmailProvider.nodeReports.set(thisVars.get("NAME"), thisVars);
        this.events.publish('moosmail:received:' + key, thisVars);
      }
    };

    setTimeout(function(){
      ws.send('NODE_REPORT');
    }, 1000);
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

