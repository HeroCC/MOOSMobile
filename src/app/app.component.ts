import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {Storage} from "@ionic/storage";
import {SplashScreen} from '@ionic-native/splash-screen';
import {CodePush} from "@ionic-native/code-push";

import {TabsPage} from '../pages/tabs/tabs';
import {MoosmailProvider} from "../providers/moosmail/moosmail";
import {AppCenterCrashes} from "@ionic-native/app-center-crashes";
import {AppCenterAnalytics} from "@ionic-native/app-center-analytics";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage,
              codePush: CodePush, acCrash: AppCenterCrashes, acAnalytics: AppCenterAnalytics) {
    platform.ready().then(() => {
      codePush.notifyApplicationReady();
      storage.get('prefs.autoUpdate').then(value => {
        if (value != null && !value) return;
        console.log("Auto Updates and Analytics are enabled, enabling now...");
        codePush.sync();
        acAnalytics.setEnabled(true);
        acCrash.setEnabled(true);
      });
      splashScreen.hide();
    });
  }

  toggleMoosUpdates() {
    MoosmailProvider.pauseUpdates = !MoosmailProvider.pauseUpdates;
  }

  get pauseUpdates(): boolean {
    return MoosmailProvider.pauseUpdates;
  }
}
