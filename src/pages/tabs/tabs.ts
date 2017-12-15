import { Component } from '@angular/core';

import { AstronautsPage } from '../astronauts/astronauts';
import { MapPage } from '../map/map';
import { PassesPage } from '../passes/passes';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = MapPage;
  tab2Root = PassesPage;
  tab3Root = AstronautsPage;

  constructor() {}
}
