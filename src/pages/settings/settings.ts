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
    this.initPref("shoresideAddress");

    navCtrl.viewWillLeave.subscribe(() => {
      this.saveSettings();
    });
  }

  initPref(key) {
    this.prefs.addControl(key, new FormControl('', [Validators.required]));
    this.storage.get("prefs." + key).then(value => {
      this.prefs.controls[key].setValue(value);
    });
  }

  saveSettings() {
    for (let key in this.prefs.controls) {
      this.storage.set("prefs." + key, this.prefs.get(key).value);
    }
  }
}
