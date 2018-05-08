import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(async () => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', [
      'backgroundColorByHexString',
      'styleDefault'
    ]);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {
      is: false,
      ready: platformReadySpy
    });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the app', async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalledTimes(1);
    await platformReadySpy;
    expect(statusBarSpy.styleDefault).toHaveBeenCalledTimes(1);
    expect(splashScreenSpy.hide).toHaveBeenCalledTimes(1);
  });

  it('sets the status bar background on Android', async () => {
    platformSpy.is.and.returnValue(true);
    TestBed.createComponent(AppComponent);
    await platformReadySpy;
    expect(platformSpy.is).toHaveBeenCalledTimes(1);
    expect(platformSpy.is).toHaveBeenCalledWith('android');
    expect(statusBarSpy.backgroundColorByHexString).toHaveBeenCalledTimes(1);
    expect(statusBarSpy.backgroundColorByHexString).toHaveBeenCalledWith('#520E7A');
  });

  it('does not set the status bar background on iOS', async () => {
    platformSpy.is.and.returnValue(false);
    TestBed.createComponent(AppComponent);
    await platformReadySpy;
    expect(statusBarSpy.backgroundColorByHexString).not.toHaveBeenCalled();
  });
});
