import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';

import { ConfigurationProvider } from '../providers/configuration/configuration';
import { IssTrackingDataProvider } from '../providers/iss-tracking-data/iss-tracking-data';
import { LocationProvider } from '../providers/location/location';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    ConfigurationProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    IssTrackingDataProvider,
    LocationProvider,
    StatusBar,
    SplashScreen
  ]
})
export class AppModule {}
