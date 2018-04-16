import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private prefs: FormGroup = new FormGroup({});

  constructor(public navCtrl: NavController, private storage: Storage) {
    this.initPref("mapLocation", "forest");

    navCtrl.viewWillLeave.subscribe(() => {
      this.saveSettings();
    });
  }

  initPref(key, defaultValue: string) {
    this.prefs.addControl(key, new FormControl('', [Validators.required]));
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
    alert("Saved! You may need to restart the app for settings to take affect");
  }
}
