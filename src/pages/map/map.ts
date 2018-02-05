import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, GoogleMapsMapTypeId, LatLng, Marker
} from "@ionic-native/google-maps";

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  moosReports: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();
  mapMarkers: Map<string, Marker> = new Map<string, Marker>();

  constructor(public navCtrl: NavController, private gmaps: GoogleMaps) {
  }

  processNodeReport(value) {
    const pairs = value.split(",");
    let thisVars = new Map();
    for (let i = 0; i < pairs.length; i++) {
      const key = pairs[i].split("=")[0];
      value = pairs[i].split("=")[1];
      thisVars.set(key, value);
    }
    const name: string = thisVars.get("NAME");
    this.moosReports.set(name, thisVars);

    if (this.mapMarkers.get(name) == null) {
      this.map.addMarker({
        title: name,
        label: name.slice(0,1),
        //snippet: "some useful details here",
        //animation: plugin.google.maps.Animation.BOUNCE
      }).then((marker: Marker) => {
        this.mapMarkers.set(name, marker)
      });
    }
  }

  updateMarkers() {
    this.mapMarkers.forEach((value: Marker, key: string) => {
      const lat: number = parseFloat(this.moosReports.get(key).get("LAT"));
      const long: number = parseFloat(this.moosReports.get(key).get("LON"));
      const head: number = parseFloat(this.moosReports.get(key).get("HDG"));
      value.setPosition(new LatLng(lat, long));
      value.setRotation(head);
    });
  }


  initializeMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.825300,
          lng: -70.330400
        },
        zoom: 16,
        tilt: 30
      },
      mapType: GoogleMapsMapTypeId.hybrid
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      let ws: WebSocket = new WebSocket("ws://10.0.0.20:9090/listen");
      ws.onmessage = (evt) => {
        const origString = evt.data;
        const key = origString.split("=")[0];
        const val = origString.slice(origString.indexOf("=") + 1);
        if (key == 'NODE_REPORT') {
          this.processNodeReport(val);
        }
        this.updateMarkers();
      };

      setTimeout(function(){
        ws.send('NODE_REPORT');
      }, 1000);
    });
  }

  ionViewDidLoad() {
    this.initializeMap();
  }
}
