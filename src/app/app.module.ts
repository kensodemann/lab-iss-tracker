import { CommonModule } from '@angular/common';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { AstronautsPage } from '../pages/astronauts/astronauts';
import { ConfigurationPage } from '../pages/configuration/configuration';
import { MapPage } from '../pages/map/map';
import { PassesPage } from '../pages/passes/passes';
import { TabsPage } from '../pages/tabs/tabs';

import { ConfigurationProvider } from '../providers/configuration/configuration';
import { IssTrackingDataProvider } from '../providers/iss-tracking-data/iss-tracking-data';
import { LocationProvider } from '../providers/location/location';

import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    MyApp,
    AstronautsPage,
    ConfigurationPage,
    MapPage,
    PassesPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AstronautsPage,
    ConfigurationPage,
    MapPage,
    MyApp,
    PassesPage,
    TabsPage
  ],
  providers: [
    ConfigurationProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IssTrackingDataProvider,
    LocationProvider,
    StatusBar,
    SplashScreen
  ]
})
export class AppModule {}
