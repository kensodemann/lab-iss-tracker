# Lab: Lazy Loading

Lazy loading works a little differently in an Ionic application than it does in an Angular application. The purpose of this lab is to show how this is accomplished in an Ionic application.

If you look at the `app.module.ts` file, you will see that we are currently pulling in each page of our application and declaring it in this module.

```ts
import { MyApp } from './app.component';
import { AstronautsPage } from '../pages/astronauts/astronauts';
import { ConfigurationPage } from '../pages/configuration/configuration';
import { MapPage } from '../pages/map/map';
import { PassesPage } from '../pages/passes/passes';
import { TabsPage } from '../pages/tabs/tabs';
```

This means that the code for every page is included in the `main.js` file, which could result in a lot of up-front loading time if the application has a lot of pages. In such cases, it may make more sense to only load pages when they are needed. This is especially true if your application has many pages but any given user typically only uses a few of them.

The strategy that Ionic uses in order to perform lazy loading is to create a module for each page, and then to not refer to the page via a reference to its component class but rather via a string.

## Steps

We will turn the app into a lazy loaded application by following these steps:

1. create a module for each page
1. add the `IonicPage()` decorator to each page
1. remove direct references to the pages
1. move some dependencies

### Create a Module for Each Page

Each page must have its own module. The basic module file looks like this:

```ts
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AstronautsPage } from './astronauts';

@NgModule({
  declarations: [AstronautsPage],
  imports: [IonicPageModule.forChild(AstronautsPage)],
  entryComponents: [AstronautsPage]
})
export class AstronautsPageModule {}
```

Create one for each page. Do not import any of these modules anywhere. That would defeat the lazy loading.

### Add the `IonicPage()` Decorator

Each page needs to have the `IonicPage()` decorator. The decorator takes a configuration object, but we will not use it for this lab as it is not strictly necessary in order to implement lazy loading. See [the IonicPage documentation](https://ionicframework.com/docs/api/navigation/IonicPage/) for further details.

### Remove Direct References to the Pages

We no longer want direct references to the page objects. Direct references would require us to declare the page in the referencing module, which in turn would pull the page into that module. This defeats lazy loading.

First, remove the references in `app.module.ts`

```diff
@@ -9,11 +9,6 @@ import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen'; 
 
import { MyApp } from './app.component'; 
- import { AstronautsPage } from '../pages/astronauts/astronauts'; 
- import { ConfigurationPage } from '../pages/configuration/configuration'; 
- import { MapPage } from '../pages/map/map'; 
- import { PassesPage } from '../pages/passes/passes'; 
- import { TabsPage } from '../pages/tabs/tabs'; 
 
import { ConfigurationProvider } from '../providers/configuration/configuration'; 
import { IssTrackingDataProvider } from '../providers/iss-tracking-data/iss-tracking-data'; 
@@ -23,12 +18,7 @@ import { PipesModule } from '../pipes/pipes.module';
 
@NgModule({ 
  declarations: [ 
-     MyApp, 
-     AstronautsPage, 
-     ConfigurationPage, 
-     MapPage, 
-     PassesPage, 
-     TabsPage 
+     MyApp 
  ], 
  imports: [ 
    BrowserModule, 
@@ -40,12 +30,7 @@ import { PipesModule } from '../pipes/pipes.module';
  ], 
  bootstrap: [IonicApp], 
  entryComponents: [ 
-     AstronautsPage, 
-     ConfigurationPage, 
-     MapPage, 
-     MyApp, 
-     PassesPage, 
-     TabsPage 
+     MyApp 
```

This will result in Angular complaining that it cannot find the components to inject when you try to view any of these pages. To solve this, remove direct references to the pages and replace this with strings. For example, change `app.component.ts` as such:

```diff
@@ -3,13 +3,11 @@ import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar'; 
import { SplashScreen } from '@ionic-native/splash-screen'; 
 
- import { TabsPage } from '../pages/tabs/tabs'; 
-  
@Component({ 
  templateUrl: 'app.html' 
}) 
export class MyApp { 
-   rootPage: any = TabsPage; 
+   rootPage: any = 'TabsPage'; 
 
  constructor( 
    platform: Platform,
```

Then make similar changes to any other file that directly references the pages.

### Final Dependency Moves

If you navigate to the passes page you will see that we still have a problem. The injector does not know about the address pipe within the `PassesPageModule`. Rectify this by importing the `PipesModule` in the `PassesPageModule`:

```diff
@@ -1,10 +1,11 @@
 import { NgModule } from '@angular/core';
 import { IonicPageModule } from 'ionic-angular';
 import { PassesPage } from './passes';
+import { PipesModule } from '../../pipes/pipes.module';

 @NgModule({
   declarations: [PassesPage],
-  imports: [IonicPageModule.forChild(PassesPage)],
+  imports: [IonicPageModule.forChild(PassesPage), PipesModule],
   entryComponents: [PassesPage]
 })
 export class PassesPageModule {}
```

We no longer need to reference the `PipesModules` at the application level, so remove the reference from the `AppModule`:

```diff
@@ -14,8 +14,6 @@ import { ConfigurationProvider } from '../providers/configuration/configuration'
 import { IssTrackingDataProvider } from '../providers/iss-tracking-data/iss-tracking-data';
 import { LocationProvider } from '../providers/location/location';

-import { PipesModule } from '../pipes/pipes.module';
-
 @NgModule({
   declarations: [
     MyApp
@@ -25,8 +23,7 @@ import { PipesModule } from '../pipes/pipes.module';
     CommonModule,
     HttpClientModule,
     HttpClientJsonpModule,
-    IonicModule.forRoot(MyApp),
-    PipesModule
+    IonicModule.forRoot(MyApp)
   ],
   bootstrap: [IonicApp],
   entryComponents: [
```

The application is now lazy loading each page. To see this run the application in the browser and open the network tab on the dev tools. When you reload the application and then move from page to page you will see a JavaScript file with a name like `8.js` is loaded. This is the code for the page that was just navigated to.

Notice also that this file is only loaded the first time that a page is navigated to. After that it is cached. The end result is that code is only loaded when it is needed and is only loaded once.

## Caveats

There are a few things to keep in mind when laying out a lazy loaded application.

An application should either be lazy loaded or not lazy loaded. You should not try to do some pages one way and other pages the other. Always follow a consistent strategy.

Each page will be lazy loaded in its own module. This packaging system does not break dependencies out into their own bundles. This means if we needed to include `PipesModule` in multiple pages, it would be included in multiple JavaScript files.

Finally, when running in the browser, you may have noticed that the URL has now changed. It used to just be `http://localhost:8100/` regardless of the page you were on. Now it looks like this: `http://localhost:8100/#/tabs/passes/passes` but when you refresh (or the app is rebuilt) you will notice that the application reverts to `http://localhost:8100/#/tabs/maps/map`. To get around this, modify the `@IonicPage()` decorator in the `TabsPage` to define a segment that is different from the default. For example:

```ts
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage({
  segment: 'tabs-page'
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = 'MapPage';
  tab2Root = 'PassesPage';
  tab3Root = 'AstronautsPage';
  tab4Root = 'ConfigurationPage';

  constructor() {}
}
```

You can use almost any value for the `segment` other than the default value of `tabs`.
