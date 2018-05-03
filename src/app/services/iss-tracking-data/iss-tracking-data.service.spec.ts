import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { IssTrackingDataService } from './iss-tracking-data.service';

describe('IssTrackingDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IssTrackingDataService]
    });
  });

  it(
    'should be created',
    inject([IssTrackingDataService], (service: IssTrackingDataService) => {
      expect(service).toBeTruthy();
    })
  );
});
