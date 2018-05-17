import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
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
import {MoosClient, MoosMail} from "../../providers/moosmail/MoosClient";

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  mapMarkers: Map<string, Marker> = new Map<string, Marker>();

  constructor(public navCtrl: NavController, private mm: MoosmailProvider, private storage: Storage){
    this.initializeMap();
  }

  updateMarkers(newThing: Map<string, string>) {
    const name: string = newThing.get("NAME");
    if (this.mapMarkers.get(name) == null) {
      let iconUrl;
      if (newThing.get("TYPE") == "KAYAK") iconUrl = 'assets/imgs/kayak.png';
      this.map.addMarker({
        title: name,
        label: name.slice(0,1),
        icon: iconUrl
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
    marker.setRotation(head + 90);
  }


  initializeMap() {
    let mapOptions: GoogleMapOptions;

    this.storage.get("prefs.mapLocation").then((value) => {
      mapOptions = {
        controls: {
          compass: true
        },
        camera: {
          zoom: 16,
          tilt: 30
        },
        mapType: GoogleMapsMapTypeId.hybrid
      };

      switch (value) {
        case "forest":
        default:
          mapOptions.camera.target = {lat: 43.825300, lng: -70.330400};
          break;

        case "mit":
          mapOptions.camera.target = {lat: 42.358456, lng: -71.087589};
          break;
      }

      this.map = GoogleMaps.create('map_canvas', mapOptions);

      // Wait the MAP_READY before using any methods.
      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.subscribeToMail();
      });
    });
  }

  subscribeToMail() {
    this.mm.knownClients.forEach((client: MoosClient, name: string) => {
      client.mailEmitter.subscribe((mail: MoosMail) => {
        if (mail.name == "NODE_REPORT") {
          this.updateMarkers(MoosmailProvider.parseString(mail.content));
        }
      });
    });

    this.mm.newClientEmitter.subscribe((client: MoosClient) => {
      client.mailEmitter.subscribe((mail: MoosMail) => {
        if (mail.name == "NODE_REPORT") {
          this.updateMarkers(MoosmailProvider.parseString(mail.content));
        }
      });
    });
  }
}
