import { Component } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Platform, ToastController} from '@ionic/angular';
import {AppVersion} from '@ionic-native/app-version/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  public binaryVersion: string = "UNKNOWN";
  public pushVersion: string = "UNKNOWN";
  private prefs: FormGroup = new FormGroup({});

  constructor(private storage: Storage, private toast: ToastController, private platform: Platform) {
    this.initPref("mapLocation", "forest");
    this.initPref("disabledPages", []);
    this.initPref("autoUpdate", false);
  }

  initPref(key, defaultValue) {
    this.prefs.addControl(key, new FormControl('', []));
    this.storage.get("prefs." + key).then(value => {
      if (value === "" || value == null) {
        value = defaultValue;
        this.storage.set("prefs." + key, defaultValue);
      }
      this.prefs.controls[key].setValue(value);
    });
  }

  saveSettings() {
    for (const key in this.prefs.controls) {
      this.storage.set("prefs." + key, this.prefs.get(key).value);
    }

    this.toast.create({
      message: "Saved! You may need to restart the app for settings to take affect",
      duration: 5000,
      position: 'top',
    }).then((toast) => toast.present());

    this.prefs.markAsPristine();
  }
}
