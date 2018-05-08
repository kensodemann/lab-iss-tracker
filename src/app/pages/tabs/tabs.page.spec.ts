import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders four tabs', () => {
    const el: HTMLElement = fixture.nativeElement;
    const tabs = el.querySelectorAll('ion-tab');
    expect(tabs.length).toEqual(4);
  });

  it('renders the maps tab', () => {
    const el: HTMLElement = fixture.nativeElement;
    const tabs = el.querySelectorAll('ion-tab');
    expect(tabs[0].attributes.getNamedItem('label').value).toEqual('Map');
  });

  it('renders the passes tab', () => {
    const el: HTMLElement = fixture.nativeElement;
    const tabs = el.querySelectorAll('ion-tab');
    expect(tabs[1].attributes.getNamedItem('label').value).toEqual('Passes');
  });

  it('renders the astronauts tab', () => {
    const el: HTMLElement = fixture.nativeElement;
    const tabs = el.querySelectorAll('ion-tab');
    expect(tabs[2].attributes.getNamedItem('label').value).toEqual('Astronauts');
  });

  it('renders the configuration tab', () => {
    const el: HTMLElement = fixture.nativeElement;
    const tabs = el.querySelectorAll('ion-tab');
    expect(tabs[3].attributes.getNamedItem('label').value).toEqual('Configuration');
  });
});
