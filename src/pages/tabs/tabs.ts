import {Component} from '@angular/core';

import {MapPage} from '../map/map';
import {SettingsPage} from '../settings/settings';
import {ListPage} from '../list/list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MapPage;
  tab2Root = ListPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
