import { Component } from '@angular/core';
import {Storage} from '@ionic/storage';
import {GoogleMap, GoogleMaps, GoogleMapsEvent, GoogleMapsMapTypeId, Marker} from '@ionic-native/google-maps';
import {MoosmailService} from '../services/moosmail/moosmail.service';
import {MoosClient, MoosMail} from '../services/moosmail/MoosClient';

const RAD_TO_DEG = 57.29577951308232;
const DEG_TO_RAD = .0174532925199432958;

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage {
  map: GoogleMap;
  mapMarkers: Map<string, Marker> = new Map();

  latOrigin: number;
  lonOrigin: number;

  constructor(private mm: MoosmailService, private storage: Storage) {
    this.initializeMap();
  }

  updateObjects(parsedMail: Map<string, string>) {
    const name: string = parsedMail.get("NAME") || parsedMail.get("LABEL");
    let iconUrl;
    switch (parsedMail.get("TYPE")) {
      case "CIRCLE":
        // TODO don't duplicate objects of the same name when position changes
        this.map.addCircle({
          center: this.LocalGrid2LatLong(parseFloat(parsedMail.get("X")), parseFloat(parsedMail.get("Y"))),
          radius: parseFloat(parsedMail.get("WIDTH")),
          strokeWidth: 2,
          fillColor: parsedMail.get("PRIMARY_COLOR"),
          strokeColor: parsedMail.get("SECONDARY_COLOR"),
        });
        break;


      case "KAYAK":
      case "MOKAI":
        iconUrl = 'assets/imgs/kayak.png';

        if (this.mapMarkers.get(name) == null) {
         this.mapMarkers.set(name, this.map.addMarkerSync({
            title: name,
            label: name.slice(0, 1),
            icon: iconUrl,
            position: {lat: 0, lng: 0}}));
        }
        const marker = this.mapMarkers.get(name);
        marker.setPosition(this.LocalGrid2LatLong(parseFloat(parsedMail.get("X")), parseFloat(parsedMail.get("Y"))));
        marker.setRotation(parseFloat(parsedMail.get("HDG")));
        break;
    }
  }


  initializeMap() {
    this.storage.get("prefs.mapLocation").then((value) => {
      switch (value) {
        case "forest":
        default:
          this.latOrigin = 43.825300;
          this.lonOrigin = -70.330400;
          break;

        case "mit":
          this.latOrigin = 42.358456;
          this.lonOrigin = -71.087589;
          break;
      }

      this.map = GoogleMaps.create('map_canvas', {
        controls: {
          compass: true,
          myLocation: true,
          myLocationButton: true,
        },
        camera: {
          zoom: 16,
          target: {lat: this.latOrigin, lng: this.lonOrigin}
        },
        preferences: {
          building: false
        },
        mapType: GoogleMapsMapTypeId.TERRAIN
      });

      // Wait the MAP_READY before using any methods.
      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.subscribeToMail();
      });
    });
  }

  subscribeToMail() {
    this.mm.newClientEmitter.subscribe((client: MoosClient) => {
      if (client == null) return;
      client.subscribe("NODE_REPORT");
      client.subscribe("VIEW_MARKER");
      client.mailEmitter.subscribe((mail: MoosMail) => {
        switch (mail.name) {
          case "NODE_REPORT":
          case "VIEW_MARKER":
            this.updateObjects(MoosmailService.parseString(mail.content.toUpperCase()));
            break;
        }
      });
    });
  }

  // 🙇 https://github.com/moos-ivp/svn-mirror/blob/master/MOOS_Aug2815/MOOSGeodesy/libMOOSGeodesy/MOOSGeodesy.cpp#L235
  LocalGrid2LatLong(dfEast: number, dfNorth: number, transform: boolean = true) {
    // (semimajor axis)
    let dfa: number = 6378137;
    // (semiminor axis)
    let dfb: number = 6356752.314245;

    let dftanlat2 = Math.pow(Math.tan( this.lonOrigin*DEG_TO_RAD), 2);
    let dfRadius = dfb*Math.sqrt(1+dftanlat2) / Math.sqrt((Math.pow(dfb,2)/Math.pow(dfa,2))+dftanlat2);

    // first calculate lat arc
    let dfYArcRad = Math.asin(dfNorth/dfRadius); // returns result in rad
    let dfYArcDeg = dfYArcRad * RAD_TO_DEG;

    let dfXArcRad = Math.asin(dfEast/(dfRadius*Math.cos(this.latOrigin*DEG_TO_RAD)));
    let dfXArcDeg = dfXArcRad * RAD_TO_DEG;

    // add the origin to these arc lengths
    let dfLat = dfYArcDeg + this.latOrigin;
    let dfLon = dfXArcDeg + this.lonOrigin;

    if (transform) {
      //alert(dfLat + " " + dfLon);
      //alert(proj4("WGS84", "GOOGLE").forward([dfLat, dfLon]));
    }

    return {lat: dfLat, lng: dfLon};
  }
}
