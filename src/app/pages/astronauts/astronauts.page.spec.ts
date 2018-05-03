import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AstronautsPage } from './astronauts.page';

describe('AstronautsPage', () => {
  let component: AstronautsPage;
  let fixture: ComponentFixture<AstronautsPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AstronautsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
