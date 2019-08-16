import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapPage } from './map.page';
import { GoogleMaps } from '@ionic-native/google-maps';
import {IonicStorageModule} from '@ionic/storage';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: MapPage }]),
  ],
  providers: [
    GoogleMaps,
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
