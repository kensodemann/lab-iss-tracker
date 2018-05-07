import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingController } from '@ionic/angular';

import { AddressPipe } from '../../pipes/address/address.pipe';
import { IssTrackingDataService } from '../../services/iss-tracking-data/iss-tracking-data.service';
import { LocationService } from '../../services/location/location.service';
import { PassesPage } from './passes.page';

describe('PassesPage', () => {
  let component: PassesPage;
  let fixture: ComponentFixture<PassesPage>;

  let issTrackingDataServiceSpy;
  let locationServiceSpy;

  beforeEach(async () => {
    issTrackingDataServiceSpy = jasmine.createSpy('IssTrackingDataService');
    locationServiceSpy = jasmine.createSpy('LocationService');
    TestBed.configureTestingModule({
      declarations: [AddressPipe, PassesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: IssTrackingDataService,
          useClass: issTrackingDataServiceSpy
        },
        LoadingController,
        { provide: LocationService, useClass: locationServiceSpy }
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
});
