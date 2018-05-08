import {
  HttpBackend,
  HttpClient,
  JsonpClientBackend
} from '@angular/common/http';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { IssTrackingDataService } from './iss-tracking-data.service';

describe('IssTrackingDataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let issTrackingDataService: IssTrackingDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IssTrackingDataService,
        { provide: JsonpClientBackend, useExisting: HttpBackend }
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    issTrackingDataService = new IssTrackingDataService(httpClient);
  });

  it(
    'should be created',
    inject([IssTrackingDataService], (service: IssTrackingDataService) => {
      expect(service).toBeTruthy();
    })
  );

  describe('location', () => {
    it('gets the locations', () => {
      issTrackingDataService.location().subscribe(x => {
        expect(x).toEqual({ longitude: -138.1719, latitude: 44.4423 });
      });
      const req = httpTestingController.expectOne(
        'http://api.open-notify.org/iss-now.json'
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        iss_position: { longitude: '-138.1719', latitude: '44.4423' },
        timestamp: 1525950644,
        message: 'success'
      });
      httpTestingController.verify();
    });
  });

  describe('nextPasses', () => {
    it('gets the next passes', () => {
      issTrackingDataService
        .nextPasses({ latitude: 43.074237, longitude: -89.381012 })
        .subscribe(x => {
          expect(x).toEqual([
            {
              duration: 496,
              riseTime: new Date(1526016794000)
            },
            {
              duration: 639,
              riseTime: new Date(1526022479000)
            },
            {
              duration: 609,
              riseTime: new Date(1526028299000)
            },
            {
              duration: 586,
              riseTime: new Date(1526034145000)
            },
            {
              duration: 628,
              riseTime: new Date(1526039952000)
            }
          ]);
        });
      const req = httpTestingController.expectOne(
        request =>
          request.url ===
          'http://api.open-notify.org/iss-pass.json?lat=43.074237&lon=-89.381012'
      );
      expect(req.request.method).toEqual('JSONP');
      req.flush({
        message: 'success',
        request: {
          altitude: 100,
          datetime: 1525978357,
          latitude: 43.074237,
          longitude: -89.381012,
          passes: 5
        },
        response: [
          {
            duration: 496,
            risetime: 1526016794
          },
          {
            duration: 639,
            risetime: 1526022479
          },
          {
            duration: 609,
            risetime: 1526028299
          },
          {
            duration: 586,
            risetime: 1526034145
          },
          {
            duration: 628,
            risetime: 1526039952
          }
        ]
      });
      httpTestingController.verify();
    });
  });

  describe('astronauts', () => {
    it('gets the locations', () => {
      issTrackingDataService.astronauts().subscribe(x => {
        expect(x).toEqual([
          { name: 'Anton Shkaplerov', craft: 'ISS' },
          { name: 'Scott Tingle', craft: 'ISS' },
          { name: 'Norishige Kanai', craft: 'ISS' },
          { name: 'Oleg Artemyev', craft: 'ISS' },
          { name: 'Andrew Feustel', craft: 'ISS' },
          { name: 'Richard Arnold', craft: 'ISS' }
        ]);
      });
      const req = httpTestingController.expectOne(
        'http://api.open-notify.org/astros.json'
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        people: [
          { name: 'Anton Shkaplerov', craft: 'ISS' },
          { name: 'Scott Tingle', craft: 'ISS' },
          { name: 'Norishige Kanai', craft: 'ISS' },
          { name: 'Oleg Artemyev', craft: 'ISS' },
          { name: 'Andrew Feustel', craft: 'ISS' },
          { name: 'Richard Arnold', craft: 'ISS' }
        ],
        number: 6,
        message: 'success'
      });
      httpTestingController.verify();
    });
  });
});
