import { Injectable } from '@angular/core';
import { Address } from '../../models/address';
import { Position } from '../../models/position';

declare var google: any;

@Injectable()
export class LocationProvider {
  private defaultPosition: Position = {
    latitude: 43.074237,
    longitude: -89.381012
  };
  private geocoder;
  private position: Position;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
    this.position = Object.assign({}, this.defaultPosition);
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

  currentPosition(): Promise<Position> {
    if ('geolocation' in navigator) {
      return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(p => {
          if (p.coords) {
            this.position.latitude = p.coords.latitude;
            this.position.longitude = p.coords.longitude;
          }
          resolve(this.position);
        });
      });
    } else {
      return Promise.resolve(this.defaultPosition);
    }
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
