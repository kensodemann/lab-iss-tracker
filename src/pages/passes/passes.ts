import { Component } from '@angular/core';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';
import { Pass } from '../../models/pass';

@Component({
  selector: 'page-passes',
  templateUrl: 'passes.html'
})
export class PassesPage {
  passes: Array<Pass>;

  constructor(private data: IssTrackingDataProvider) {}

  ionViewDidEnter() {
    this.data.nextPasses({ latitude: 43.074237, longitude: -89.381012 }).subscribe(p => this.passes = p);
  }
}
