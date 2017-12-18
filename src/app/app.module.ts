import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AstronautsPage } from '../pages/astronauts/astronauts';
import { MapPage } from '../pages/map/map';
import { PassesPage } from '../pages/passes/passes';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IssTrackingDataProvider } from '../providers/iss-tracking-data/iss-tracking-data';

@NgModule({
  declarations: [
    MyApp,
    AstronautsPage,
    MapPage,
    PassesPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AstronautsPage,
    MapPage,
    PassesPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IssTrackingDataProvider
  ]
})
export class AppModule {}
