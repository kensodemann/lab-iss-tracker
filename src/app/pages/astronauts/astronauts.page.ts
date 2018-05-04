import { Component } from '@angular/core';
import { Astronaut } from '../../models/astronaut';
import { IssTrackingDataService } from '../../services/iss-tracking-data/iss-tracking-data.service';

@Component({
  selector: 'app-page-contact',
  templateUrl: 'astronauts.page.html',
  styleUrls: ['astronauts.page.scss']
})
export class AstronautsPage {
  astronauts: Array<Astronaut>;

  constructor(private data: IssTrackingDataService) {}

  ionViewDidEnter() {
    this.data.astronauts().subscribe(a => (this.astronauts = a));
  }
}
