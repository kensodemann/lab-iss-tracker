import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { IssTrackingDataService } from '../../services/iss-tracking-data/iss-tracking-data.service';
import { Address } from '../../models/address';
import { Pass } from '../../models/pass';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-page-passes',
  templateUrl: 'passes.page.html',
  styleUrls: ['passes.page.scss']
})
export class PassesPage {
  address: Address;
  passes: Array<Pass>;

  constructor(
    private data: IssTrackingDataService,
    private loadingCtrl: LoadingController,
    private location: LocationService
  ) {}

  async ionViewDidEnter() {
    const loading = await this.loadingCtrl.create({
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
