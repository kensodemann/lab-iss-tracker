import { Component } from '@angular/core';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { IssTrackingDataService } from '../../services/iss-tracking-data/iss-tracking-data.service';
import { Position } from '../../models/position';

declare var google: any;

@Component({
  selector: 'app-page-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage {
  private interval;
  private map;
  private marker;

  constructor(
    private configuration: ConfigurationService,
    private data: IssTrackingDataService
  ) {}

  async ionViewDidEnter() {
    console.log('in ionViewDidEnter');
    this.showLocation();
    await this.configuration.init();
    this.interval = setInterval(
      this.showLocation.bind(this),
      this.configuration.refreshRate * 1000
    );
  }

  ionViewDidLeave() {
    console.log('in ionViewDidLeave');
    clearInterval(this.interval);
  }

  private showLocation() {
    this.data.location().subscribe(p => {
      if (this.map) {
        this.moveMap(p);
      } else {
        this.createMap(p);
      }
    });
  }

  private createMap(pos: Position) {
    console.log('creating the map');
    this.map = new google.maps.Map(
      document.getElementById('iss-tracking-map'),
      {
        center: new google.maps.LatLng(pos.latitude, pos.longitude),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(pos.latitude, pos.longitude),
      map: this.map,
      animation: google.maps.Animation.DROP
    });
  }

  private moveMap(pos: Position) {
    this.map.panTo(new google.maps.LatLng(pos.latitude, pos.longitude));
    this.marker.setPosition(
      new google.maps.LatLng(pos.latitude, pos.longitude)
    );
  }
}
