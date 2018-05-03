import { TestBed, inject } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()],
      providers: [ConfigurationService, Platform]
    });
  });

  it(
    'should be created',
    inject([ConfigurationService], (service: ConfigurationService) => {
      expect(service).toBeTruthy();
    })
  );
});
