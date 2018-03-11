import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

import {MapPage} from '../pages/map/map';
import {SettingsPage} from '../pages/settings/settings';
import {ListPage} from '../pages/list/list';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GoogleMaps} from "@ionic-native/google-maps";
import {MoosmailProvider} from '../providers/moosmail/moosmail';
import {IonicStorageModule} from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    SettingsPage,
    ListPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    SettingsPage,
    ListPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MoosmailProvider
  ]
})
export class AppModule {}
