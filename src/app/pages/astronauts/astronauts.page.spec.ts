import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AstronautsPage } from './astronauts.page';
import { IssTrackingDataService } from '../../services/iss-tracking-data/iss-tracking-data.service';

describe('AstronautsPage', () => {
  let component: AstronautsPage;
  let fixture: ComponentFixture<AstronautsPage>;

  let issDataTrackingServiceSpy;

  beforeEach(async () => {
    issDataTrackingServiceSpy = jasmine.createSpy('IssDataTrackingService');
    TestBed.configureTestingModule({
      declarations: [AstronautsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: IssTrackingDataService, useValue: issDataTrackingServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AstronautsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
