import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassesPage } from './passes.page';

describe('PassesPage', () => {
  let component: PassesPage;
  let fixture: ComponentFixture<PassesPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PassesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
