import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';
import { Address } from '../../models/address';
import { Pass } from '../../models/pass';
import { LocationProvider } from '../../providers/location/location';

@IonicPage()
@Component({
  selector: 'page-passes',
  templateUrl: 'passes.html'
})
export class PassesPage {
  address: Address;
  passes: Array<Pass>;

  constructor(
    private data: IssTrackingDataProvider,
    private loadingCtrl: LoadingController,
    private location: LocationProvider
  ) {}

  async ionViewDidEnter() {
    const loading = this.loadingCtrl.create({
      content: 'Loading passes for this location...'
    });
    loading.present();
    const position = await this.location.currentPosition();
    this.data
      .nextPasses(position)
      .subscribe(p => (this.passes = p));
    this.address = await this.location.address(position);
    loading.dismiss();
  }
}
