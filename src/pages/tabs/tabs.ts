import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = 'MapPage';
  tab2Root = 'PassesPage';
  tab3Root = 'AstronautsPage';
  tab4Root = 'ConfigurationPage';

  constructor() {}
}
