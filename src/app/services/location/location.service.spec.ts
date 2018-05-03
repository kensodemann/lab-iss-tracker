import { TestBed, inject } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { LocationService } from './location.service';

describe('LocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [LocationService, Platform]
    });

    window['google'] = {
      maps: {
        Geocoder: function() { },
        LatLng: function() { }
      }
    };
  });

  it('should be created', inject([LocationService], (service: LocationService) => {
    expect(service).toBeTruthy();
  }));
});
