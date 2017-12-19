import { Component } from '@angular/core';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';

@Component({
  selector: 'page-passes',
  templateUrl: 'passes.html'
})
export class PassesPage {
  constructor(private data: IssTrackingDataProvider) {}

  ionViewDidLoad() {
    console.log('I have loaded the passes view');
  }

  ionViewDidEnter() {
    console.log('I have entered the passes view');
  }
}
