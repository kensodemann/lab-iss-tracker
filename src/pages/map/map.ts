import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  private map;
  private marker;

  constructor(private navCtrl: NavController) {}

  ionViewDidLoad() {
    this.createMap();
  }

  private createMap() {
    this.map = new google.maps.Map(
      document.getElementById('iss-tracking-map'),
      {
        center: new google.maps.LatLng(43.074237, -89.381012),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(43.074237, -89.381012),
      map: this.map,
      title: 'Ionic HQ',
      animation: google.maps.Animation.DROP
    });
  }
}