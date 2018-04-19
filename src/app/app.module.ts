import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';

import {MapPage} from '../pages/map/map';
import {SettingsPage} from '../pages/settings/settings';
import {MailPage} from '../pages/mail/mail';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {GoogleMaps} from "@ionic-native/google-maps";
import {MoosmailProvider} from '../providers/moosmail/moosmail';
import {IonicStorageModule} from "@ionic/storage";
import {MomentModule} from "ngx-moment";
import {AppcastPage} from "../pages/appcast/appcast";
import {PhonegapLocalNotification} from "@ionic-native/phonegap-local-notification";

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    AppcastPage,
    SettingsPage,
    MailPage,
    TabsPage
  ],
  imports: [
    MomentModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    AppcastPage,
    SettingsPage,
    MailPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    PhonegapLocalNotification,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MoosmailProvider
  ]
})
export class AppModule {}
