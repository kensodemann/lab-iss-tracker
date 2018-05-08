import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { LoadingController } from '@ionic/angular';
import { empty } from 'rxjs';

import { AddressPipe } from '../../pipes/address/address.pipe';
import { IssTrackingDataService } from '../../services/iss-tracking-data/iss-tracking-data.service';
import { LocationService } from '../../services/location/location.service';
import { PassesPage } from './passes.page';

describe('PassesPage', () => {
  let component: PassesPage;
  let fixture: ComponentFixture<PassesPage>;

  let issTrackingDataServiceSpy;
  let loadingAlertSpy;
  let loadingControllerSpy;
  let locationServiceSpy;

  let addressResolver;
  let currentPositionResolver;
  let loadingResolver;

  beforeEach(async () => {
    issTrackingDataServiceSpy = jasmine.createSpyObj('IssTrackingDataService', {
      nextPasses: empty()
    });
    loadingAlertSpy = jasmine.createSpyObj('LoadingAlert', [
      'dismiss',
      'present'
    ]);
    addressResolver = Promise.resolve();
    currentPositionResolver = Promise.resolve({
      latitude: 45.425,
      longitude: -56.523
    });
    loadingResolver = Promise.resolve(loadingAlertSpy);
    locationServiceSpy = jasmine.createSpyObj('LocationService', {
      currentPosition: currentPositionResolver,
      address: addressResolver
    });
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', {
      create: loadingResolver
    });
    TestBed.configureTestingModule({
      declarations: [AddressPipe, PassesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: IssTrackingDataService,
          useValue: issTrackingDataServiceSpy
        },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: LocationService, useValue: locationServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on enter', () => {
    it('shows a loading indicator', async () => {
      component.ionViewDidEnter();
      expect(loadingControllerSpy.create).toHaveBeenCalledTimes(1);
      expect(loadingControllerSpy.create).toHaveBeenCalledWith({
        content: 'Loading passes for this location...'
      });
      await loadingResolver;
      expect(loadingAlertSpy.present).toHaveBeenCalledTimes(1);
      expect(loadingAlertSpy.dismiss).not.toHaveBeenCalled();
    });

    it('gets the current position', async () => {
      component.ionViewDidEnter();
      expect(locationServiceSpy.currentPosition).not.toHaveBeenCalled();
      await loadingResolver;
      expect(locationServiceSpy.currentPosition).toHaveBeenCalledTimes(1);
    });

    it('gets next passes for this current position', async () => {
      component.ionViewDidEnter();
      await loadingResolver;
      await currentPositionResolver;
      expect(issTrackingDataServiceSpy.nextPasses).toHaveBeenCalledTimes(1);
      expect(issTrackingDataServiceSpy.nextPasses).toHaveBeenCalledWith({
        latitude: 45.425,
        longitude: -56.523
      });
    });

    it('gets the address for the current position', async () => {
      component.ionViewDidEnter();
      await loadingResolver;
      await currentPositionResolver;
      expect(locationServiceSpy.address).toHaveBeenCalledTimes(1);
      expect(locationServiceSpy.address).toHaveBeenCalledWith({
        latitude: 45.425,
        longitude: -56.523
      });
    });

    it('hides the loading indicator', async () => {
      component.ionViewDidEnter();
      await loadingResolver;
      await currentPositionResolver;
      expect(loadingAlertSpy.dismiss).not.toHaveBeenCalled();
      await addressResolver;
      expect(loadingAlertSpy.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
