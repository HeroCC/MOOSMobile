import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {
  GoogleMap,
  GoogleMapOptions,
  GoogleMaps,
  GoogleMapsEvent,
  GoogleMapsMapTypeId,
  LatLng,
  Marker
} from "@ionic-native/google-maps";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";
import {MoosClient} from "../../providers/moosmail/MoosClient";

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  mapMarkers: Map<string, Marker> = new Map<string, Marker>();

  constructor(public navCtrl: NavController, private mm: MoosmailProvider){
    this.mm.knownClients.forEach((value, key) => {
      value.mailEmitter.subscribe((mailName: string) => {
        if (mailName == "NODE_REPORT") {
          this.updateMarkers(MoosmailProvider.processMailString(value.receivedMail.get(mailName)));
        }
      });
    });

    this.mm.newClientEmitter.subscribe((client: MoosClient) => {
      client.mailEmitter.subscribe((mailName: string) => {
        if (mailName == "NODE_REPORT") {
          this.updateMarkers(MoosmailProvider.processMailString(client.receivedMail.get(mailName)));
        }
      });
    });
  }

  updateMarkers(newThing: Map<string, string>) {
    const name: string = newThing.get("NAME");
    if (this.mapMarkers.get(name) == null) {
      this.map.addMarker({
        title: name,
        label: name.slice(0,1),
        icon: 'assets/imgs/kayak.svg'
        //snippet: "some useful details here",
        //animation: plugin.google.maps.Animation.BOUNCE
      }).then((marker: Marker) => {
        this.mapMarkers.set(name, marker);
      });
    }
    MapPage.updateMarker(this.mapMarkers.get(name), newThing);
  }

  static updateMarker(marker: Marker, nodeReport: Map<string, string>) {
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
