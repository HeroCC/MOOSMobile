import {Component} from '@angular/core';

import {MapPage} from '../map/map';
import {SettingsPage} from '../settings/settings';
import {MailPage} from '../mail/mail';
import {AppcastPage} from "../appcast/appcast";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = MailPage;
  tab3Root = AppcastPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
