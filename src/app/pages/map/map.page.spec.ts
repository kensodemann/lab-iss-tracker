import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { IssTrackingDataService } from '../../services/iss-tracking-data/iss-tracking-data.service';
import { MapPage } from './map.page';

describe('MapPage', () => {
  let component: MapPage;
  let fixture: ComponentFixture<MapPage>;

  let configurationServiceSpy;
  let issTrackingDataServiceSpy;

  beforeEach(async () => {
    configurationServiceSpy = jasmine.createSpy('ConfigurationService');
    issTrackingDataServiceSpy = jasmine.createSpy('ConfigurationService');
    TestBed.configureTestingModule({
      declarations: [MapPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ConfigurationService, userValue: configurationServiceSpy },
        {
          provide: IssTrackingDataService,
          userValue: issTrackingDataServiceSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
