import { Component } from '@angular/core';
import { Astronaut } from '../../models/astronaut';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';

@Component({
  selector: 'page-astronauts',
  templateUrl: 'astronauts.html'
})
export class AstronautsPage {
  astronauts: Array<Astronaut>;

  constructor(private data: IssTrackingDataProvider) {}

  ionViewDidEnter() {
    this.data.astronauts().subscribe(a => this.astronauts = a);
  }
}
