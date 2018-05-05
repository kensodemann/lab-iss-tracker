import { Component } from '@angular/core';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { LocationService } from '../../services/location/location.service';

@Component({
    selector: 'app-configuration',
    templateUrl: './configuration.page.html',
    styleUrls: ['./configuration.page.scss'],
})
export class ConfigurationPage {
  private originalAddress: string;

  address: string;
  refreshRate: string;
  useLocation: boolean;

  constructor(
    private configuration: ConfigurationService,
    private location: LocationService
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
