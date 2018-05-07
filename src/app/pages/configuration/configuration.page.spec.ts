import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { ConfigurationPage } from './configuration.page';
import { LocationService } from '../../services/location/location.service';
import { Config } from '@ionic/core';

describe('ConfigurationPage', () => {
  let component: ConfigurationPage;
  let fixture: ComponentFixture<ConfigurationPage>;

  let configurationServiceSpy;
  let locationServiceSpy;

  beforeEach(async(() => {
    configurationServiceSpy = jasmine.createSpy('ConfigurationService');
    locationServiceSpy = jasmine.createSpy('LocationService');
    TestBed.configureTestingModule({
      declarations: [ConfigurationPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ConfigurationService,
          useValue: configurationServiceSpy
        },
        {
          provide: LocationService,
          useValue: locationServiceSpy
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
