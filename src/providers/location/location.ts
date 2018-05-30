import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Address } from '../../models/address';
import { ConfigurationProvider } from '../../providers/configuration/configuration';
import { Position } from '../../models/position';

declare var google: any;

@Injectable()
export class LocationProvider {
  private defaultPosition: Position = {
    latitude: 43.074237,
    longitude: -89.381012
  };
  private geocoder;
  private _currentPosition: Position;

  constructor(
    private configuration: ConfigurationProvider,
    private geolocation: Geolocation,
    private platform: Platform
  ) {
    this.geocoder = new google.maps.Geocoder();
    this._currentPosition = Object.assign({}, this.defaultPosition);
  }

  address(position: Position): Promise<Address> {
    const latLng = new google.maps.LatLng(
      position.latitude,
      position.longitude
    );
    return new Promise(resolve => {
      this.geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(this.buildAddress(results[0].address_components));
        } else {
          resolve({ streetNumber: 'Unknown Address' });
        }
      });
    });
  }

  position(address: string): Promise<Position> {
    return new Promise(resolve => {
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng()
          });
        } else {
          resolve(this.defaultPosition);
        }
      });
    });
  }

  async currentPosition(): Promise<Position> {
    await this.configuration.init();
    if (this.configuration.useCurrentLocation && this.canGeolocate()) {
      return await this.getCurrentPosition();
    } else {
      return this.configuration.position || this.defaultPosition;
    }
  }

  private canGeolocate(): boolean {
    return this.platform.is('cordova') || 'geolocation' in navigator;
  }

  private getCurrentPosition(): Promise<Position> {
    if (this.platform.is('cordova')) {
      return this.geolocation.getCurrentPosition({ timeout: 10000 }).then(p => {
        if (p.coords) {
          this._currentPosition.latitude = p.coords.latitude;
          this._currentPosition.longitude = p.coords.longitude;
        }
        return this._currentPosition;
      });
    } else {
      return this.getLocationViaWebApi();
    }
  }

  private getLocationViaWebApi(): Promise<Position> {
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(p => {
        if (p.coords) {
          this._currentPosition.latitude = p.coords.latitude;
          this._currentPosition.longitude = p.coords.longitude;
        }
        resolve(this._currentPosition);
      });
    });
  }

  private buildAddress(fields): Address {
    return fields.reduce((acc, curr) => {
      const field = this.fieldName(curr.types);
      if (field) {
        acc[field] = curr.short_name;
      }
      return acc;
    }, {});
  }

  private fieldName(t: Array<string>): string {
    if (t.indexOf('street_number') > -1) {
      return 'streetNumber';
    }
    if (t.indexOf('route') > -1) {
      return 'street';
    }
    if (t.indexOf('locality') > -1) {
      return 'city';
    }
    if (t.indexOf('administrative_area_level_1') > -1) {
      return 'area';
    }
    if (t.indexOf('postal_code') > -1) {
      return 'postalCode';
    }
  }
}
