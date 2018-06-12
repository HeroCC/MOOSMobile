import {Component} from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {FormControl, FormGroup} from '@angular/forms';
import {CodePush} from "@ionic-native/code-push";
import {AppVersion} from "@ionic-native/app-version";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public binaryVersion: string = "UNKNOWN";
  public pushVersion: string = "UNKNOWN";
  private prefs: FormGroup = new FormGroup({});

  constructor(public navCtrl: NavController, private storage: Storage, private toast: ToastController,
              codePush: CodePush, appVersion: AppVersion, platform: Platform) {
    this.initPref("mapLocation", "forest");
    this.initPref("disabledPages", []);
    this.initPref("autoUpdate", true);

    if (platform.is('cordova')) {
      appVersion.getVersionCode().then((data) => {
        this.binaryVersion = data;
      });

      codePush.getCurrentPackage().then((data) => {
        this.pushVersion = data.appVersion + "-" + data.label;
      });
    }
  }

  initPref(key, defaultValue) {
    this.prefs.addControl(key, new FormControl('', []));
    this.storage.get("prefs." + key).then(value => {
      if (value == "" || value == null) {
        value = defaultValue;
        this.storage.set("prefs." + key, defaultValue);
      }
      this.prefs.controls[key].setValue(value);
    });
  }

  saveSettings() {
    for (let key in this.prefs.controls) {
      this.storage.set("prefs." + key, this.prefs.get(key).value);
    }

    this.toast.create({
      message: "Saved! You may need to restart the app for settings to take affect",
      duration: 5000,
      dismissOnPageChange: true,
      position: 'top',
    }).present();

    this.prefs.markAsPristine();
  }
}
