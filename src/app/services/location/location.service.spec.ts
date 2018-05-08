import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { Address } from '../../models/address';
import { ConfigurationService } from '../configuration/configuration.service';
import { LocationService } from './location.service';
import { Position } from '../../models/position';
import { configFromURL } from '@ionic/core';

describe('LocationService', () => {
  let configurationServiceSpy;
  let geocoder;
  let locationService: LocationService;
  let testAddresses;
  let testLocations;

  beforeEach(() => {
    initializeTestData();

    configurationServiceSpy = {
      init: jasmine.createSpy('init'),
      useCurrentLocation: false
    };

    geocoder = jasmine.createSpyObj('geocoder', ['geocode']);
    window['google'] = {
      maps: {
        Geocoder: function() {
          return geocoder;
        },
        LatLng: function(lat: number, lng: number) {
          this.lat = lat;
          this.lng = lng;
        }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        LocationService,
        { provide: ConfigurationService, useValue: configurationServiceSpy }
      ]
    });
    locationService = new LocationService(configurationServiceSpy);
  });

  it(
    'should be created',
    inject([LocationService], (service: LocationService) => {
      expect(service).toBeTruthy();
    })
  );

  describe('address', () => {
    it('calls the geocoder', () => {
      locationService.address({ latitude: 72.34, longitude: 44.57 });
      expect(geocoder.geocode).toHaveBeenCalledTimes(1);
      expect(geocoder.geocode.calls.first().args[0]).toEqual({
        location: new window['google'].maps.LatLng(72.34, 44.57)
      });
    });

    it(
      'resolves an address object if everything is OK',
      fakeAsync(() => {
        let addr: Address;
        locationService
          .address({ latitude: 72.34, longitude: 44.57 })
          .then(a => (addr = a));
        const geocodeCallback = geocoder.geocode.calls.first().args[1];
        geocodeCallback(testAddresses, 'OK');
        tick();
        expect(addr).toEqual({
          streetNumber: '1600',
          street: 'Amphitheatre Pkwy',
          city: 'Mountain View',
          area: 'CA',
          postalCode: '94043'
        });
      })
    );

    it(
      'resolves an empty address if no address data was returned',
      fakeAsync(() => {
        let addr: Address;
        locationService
          .address({ latitude: 72.34, longitude: 44.57 })
          .then(a => (addr = a));
        const geocodeCallback = geocoder.geocode.calls.first().args[1];
        geocodeCallback([], 'OK');
        tick();
        expect(addr).toEqual({ streetNumber: 'Unknown Address' });
      })
    );

    it(
      'resolves an empty address if the status is not OK',
      fakeAsync(() => {
        let addr: Address;
        locationService
          .address({ latitude: 72.34, longitude: 44.57 })
          .then(a => (addr = a));
        const geocodeCallback = geocoder.geocode.calls.first().args[1];
        geocodeCallback(testAddresses, 'NOT-OK');
        tick();
        expect(addr).toEqual({ streetNumber: 'Unknown Address' });
      })
    );
  });

  describe('position', () => {
    it('calls the geocoder', () => {
      locationService.position('123 South Main Street, Fillmore, VA');
      expect(geocoder.geocode).toHaveBeenCalledTimes(1);
      expect(geocoder.geocode.calls.first().args[0]).toEqual({
        address: '123 South Main Street, Fillmore, VA'
      });
    });

    it(
      'resolves the location',
      fakeAsync(() => {
        let position: Position;
        locationService
          .position('123 South Main Street, Fillmore, VA')
          .then(p => (position = p));
        const geocodeCallback = geocoder.geocode.calls.first().args[1];
        geocodeCallback(testLocations, 'OK');
        tick();
        expect(position).toEqual({ latitude: 77.45, longitude: 42.779 });
      })
    );

    it(
      'resolves the default location if no data was returned',
      fakeAsync(() => {
        let position: Position;
        locationService
          .position('123 South Main Street, Fillmore, VA')
          .then(p => (position = p));
        const geocodeCallback = geocoder.geocode.calls.first().args[1];
        geocodeCallback([], 'OK');
        tick();
        expect(position).toEqual({
          latitude: 43.074237,
          longitude: -89.381012
        });
      })
    );

    it(
      'resolves the default location if the status is NOT-OK',
      fakeAsync(() => {
        let position: Position;
        locationService
          .position('123 South Main Street, Fillmore, VA')
          .then(p => (position = p));
        const geocodeCallback = geocoder.geocode.calls.first().args[1];
        geocodeCallback(testAddresses, 'NOT-OK');
        tick();
        expect(position).toEqual({
          latitude: 43.074237,
          longitude: -89.381012
        });
      })
    );
  });

  function initializeTestData() {
    testAddresses = [
      {
        address_components: [
          {
            long_name: '1600',
            short_name: '1600',
            types: ['street_number']
          },
          {
            long_name: 'Amphitheatre Pkwy',
            short_name: 'Amphitheatre Pkwy',
            types: ['route']
          },
          {
            long_name: 'Mountain View',
            short_name: 'Mountain View',
            types: ['locality', 'political']
          },
          {
            long_name: 'Santa Clara County',
            short_name: 'Santa Clara County',
            types: ['administrative_area_level_2', 'political']
          },
          {
            long_name: 'California',
            short_name: 'CA',
            types: ['administrative_area_level_1', 'political']
          },
          {
            long_name: 'United States',
            short_name: 'US',
            types: ['country', 'political']
          },
          {
            long_name: '94043',
            short_name: '94043',
            types: ['postal_code']
          }
        ]
      },
      {
        address_components: [
          {
            long_name: '1250',
            short_name: '1250',
            types: ['street_number']
          },
          {
            long_name: 'Main St',
            short_name: 'Main St',
            types: ['route']
          },
          {
            long_name: 'Ixonia',
            short_name: 'Ixonia',
            types: ['locality', 'political']
          },
          {
            long_name: 'Jefferson County',
            short_name: 'Jefferson County',
            types: ['administrative_area_level_2', 'political']
          },
          {
            long_name: 'Wisconsin',
            short_name: 'WI',
            types: ['administrative_area_level_1', 'political']
          },
          {
            long_name: 'United States',
            short_name: 'US',
            types: ['country', 'political']
          },
          {
            long_name: '53036',
            short_name: '53036',
            types: ['postal_code']
          }
        ]
      }
    ];

    testLocations = [
      {
        geometry: {
          location: {
            lat: function() {
              return 77.45;
            },
            lng: function() {
              return 42.779;
            }
          }
        }
      },
      {
        geometry: {
          location: {
            lat: function() {
              return 16.73;
            },
            lng: function() {
              return -43.994;
            }
          }
        }
      },
      {
        geometry: {
          location: {
            lat: function() {
              return 37.045;
            },
            lng: function() {
              return -89.779;
            }
          }
        }
      }
    ];
  }
});
