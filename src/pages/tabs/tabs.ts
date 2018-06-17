import {Component, ViewChild} from '@angular/core';
import {Storage} from "@ionic/storage";

import {MapPage} from '../map/map';
import {SettingsPage} from '../settings/settings';
import {MailPage} from '../mail/mail';
import {AppcastPage} from "../appcast/appcast";
import {Tabs} from "ionic-angular";
import {ButtonsPage} from "../buttons/buttons";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('tabs') tabRef: Tabs;

  tab1Root = MapPage;
  tab2Root = MailPage;
  tab3Root = AppcastPage;
  tab4Root = ButtonsPage;
  tab5Root = SettingsPage;

  constructor(private storage: Storage) {
    this.storage.get("prefs.disabledPages").then(((value: string[]) => {
      let disabledPages = new Set(value);
      for (let tab of this.tabRef.getAllChildNavs()){
        tab.show = !disabledPages.has(tab.tabTitle.toLowerCase());
        if (tab.isSelected && !tab.show) this.tabRef.select(tab.index + 1); // Navigate away from tab if it is disabled
      }
    }));
  }
}
