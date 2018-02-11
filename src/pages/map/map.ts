import { Component } from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {
  GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, GoogleMapsMapTypeId, LatLng, Marker
} from "@ionic-native/google-maps";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  mapMarkers: Map<string, Marker> = new Map<string, Marker>();

  constructor(public navCtrl: NavController, private gmaps: GoogleMaps, public events: Events) {
    events.subscribe('moosmail:received:NODE_REPORT', (varsMap: Map<string, string>) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.updateMarkers(varsMap);
    });
  }

  updateMarkers(newThing?: Map<string, string>) {
    const name: string = newThing.get("NAME");
    if (this.mapMarkers.get(name) == null) {
      this.map.addMarker({
        title: name,
        label: name.slice(0,1),
        //snippet: "some useful details here",
        //animation: plugin.google.maps.Animation.BOUNCE
      }).then((marker: Marker) => {
        this.mapMarkers.set(name, marker);
      });
    }

    if (newThing != null) {
      this.updateMarker(this.mapMarkers.get(name), newThing);
    } else {
      this.mapMarkers.forEach((value: Marker, key: string) => {
        this.updateMarker(value, MoosmailProvider.nodeReports.get(key));
      });
    }
  }

  updateMarker(marker: Marker, nodeReport: Map<string, string>) {
    if (marker == null || nodeReport == null) return;
    const lat: number = parseFloat(nodeReport.get("LAT"));
    const long: number = parseFloat(nodeReport.get("LON"));
    const head: number = parseFloat(nodeReport.get("HDG"));
    marker.setPosition(new LatLng(lat, long));
    marker.setRotation(head);
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

    });
  }

  ionViewDidLoad() {
    this.initializeMap();
  }
}
