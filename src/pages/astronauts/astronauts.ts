import { Component } from '@angular/core';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';

@Component({
  selector: 'page-astronauts',
  templateUrl: 'astronauts.html'
})
export class AstronautsPage {
  constructor(private data: IssTrackingDataProvider) {}

  ionViewDidLoad() {
    console.log('I have loaded the astronaut view');
  }

  ionViewDidEnter() {
    console.log('I have entered the astronaut view');
  }
}
