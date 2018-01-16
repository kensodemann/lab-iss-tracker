import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { ConfigurationProvider } from '../../providers/configuration/configuration';
import { LocationProvider } from '../../providers/location/location';

@IonicPage()
@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html'
})
export class ConfigurationPage {
  private originalAddress: string;

  address: string;
  refreshRate: string;
  useLocation: boolean;

  constructor(
    private configuration: ConfigurationProvider,
    private location: LocationProvider
  ) {}

  ionViewDidEnter() {
    this.address = this.configuration.address;
    this.refreshRate =
      this.configuration.refreshRate &&
      this.configuration.refreshRate.toString();
    this.useLocation = this.configuration.useCurrentLocation;
    this.originalAddress = this.address;
  }

  addressChanged(): void {
    (async () => {
      this.configuration.address = this.address;
      this.configuration.position = await this.location.position(this.address);
    })();
  }

  ionViewWillLeave() {
    this.configuration.refreshRate =
      this.refreshRate && parseInt(this.refreshRate);
    this.configuration.useCurrentLocation = this.useLocation;
  }
}
