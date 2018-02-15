# Lab: International Space Station Tracker

The purpose of this lab is to introduce you to the Ionic CLI, the Ionic Framework, and the basic structure of an Ionic application. This lab's repo contains tags for each step. To use this repo to walk through the repo:

- `git checkout tags/step1`
- in a separate project, follow the instructions for the step (instructions are in reverse order, so current instructions are always at the top)
- `git checkout tabs/step2`
- compare your results to the results in this repo
- repeat until you run out of steps

Each step will contain a short section with a series of steps to take followed by a detailed explanation. Feel free to skim the information in the details. It is there if you need more information, but some people learn best by following the overview steps and working the rest out for themselves. Do whatever works best for you.

By the end of this lab, you should be able to:

- create a new Ionic application
- modify existing pages
- add new services
- add and deploy to mobile platforms
- add and use new Cordova plugins

## Step #10 - Add a Configuration Page

### Overview

For the final step, we will add a simple configuration page. We will have two options:

1. show passes for - show the passes for a specific address rather than getting the current location
1. refresh rate - how often to refresh the map view, in seconds

### Details

We will:

1. add the [Ionic Storage](https://github.com/ionic-team/ionic-storage) module
1. create a provider for our configuration items
1. create a page

#### Adding the Plugin

First we need to install the module:

```bash
$ npm install --save @ionic/storage
```

This module will store data in the best storage engine available to you on whichever platform you are running. The current prioritization is: SQLite, IndexedDB, WebSQL, and LocalStorage. Of these, SQLLite is the only one that is guarenteed to not be clobbered by the mobile OS if space is tight on the host device. However, it requires extra setup so we will skip that for this lab.

Then we need to update the app's main module to make the storage module available.

```ts
...

import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

...

@NgModule({

...
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    PipesModule
  ],
...
```

#### Creating the Provider

The configuration data is abstracted into a provider. This allows us to handle all of the logic associated with the data in a centralized manner.

```bash
$ ionic g provider configuration
```

Here is the code for the provider.

```ts
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Position } from '../../models/position';

@Injectable()
export class ConfigurationProvider {
  private _address: string;
  private _position: Position;
  private _refreshRate: number;
  private _useCurrentLocation: boolean;
  private _promise: Promise<void>;

  private _addressKey = 'address';
  private _positionKey = 'position';
  private _refreshRateKey = 'refreshRate';
  private _useCurrentLocationKey = 'useCurrentLocation';

  constructor(
    private platform: Platform,
    private storage: Storage
  ) { }

  init(): Promise<void> {
    if (!this._promise) {
      this._promise = this.loadData();
    }
    return this._promise;
  }

  set address(value: string) {
    this._address = value;
    this.store(this._addressKey, value);
  }

  get address(): string {
    return this._address;
  }

  set position(value: Position) {
    this._position = value;
    this.store(this._positionKey, value);
  }

  get position(): Position {
    return this._position;
  }

  set refreshRate(value: number) {
    this._refreshRate = value;
    this.store(this._refreshRateKey, value);
  }

  get refreshRate(): number {
    return this._refreshRate || 15;
  }

  set useCurrentLocation(value: boolean) {
    this._useCurrentLocation = value;
    this.store(this._useCurrentLocationKey, value);
  }

  get useCurrentLocation(): boolean {
    return this._useCurrentLocation === false ? false : true;
  }

  private async loadData(): Promise<void> {
    await this.platform.ready();
    await this.loadFromAppPreferences();
  }

  private async loadFromAppPreferences(): Promise<void> {
    await this.storage.ready();
    await Promise.all([
      this._address = await this.storage.get(this._addressKey),
      this._position = await this.storage.get(this._positionKey),
      this._refreshRate = await this.storage.get(this._refreshRateKey),
      this._useCurrentLocation = await this.storage.get(this._useCurrentLocationKey),
    ]);
  }

  private async store(key: string, value: any) {
    await this.storage.ready();
    this.storage.set(
      key,
      key === this._positionKey
        ? value && JSON.stringify(value)
        : value && value.toString()
    );
  }
}
```

Make sure the provider was added to your `app.module.ts` file.

#### Adding the Page

Now we can add the configuration page itself.

```bash
$ ionic g page configuration
```

The generator assumes we are using lazy loading, which we are not. This means that we need to manually add the page to our `app.modules.ts` file. This also means that we can remove the `ionicPage` decorator from the generated code and remove the module that was generated for the page. You could also leave those items there, but I like all of my pages to be consistent in general structure, so I remove them. They will need to be added for all pages if we ever switch to lazy loading.

We need another tab in order to display the configuration page:

**tabs.ts**
```ts
import { AstronautsPage } from '../astronauts/astronauts'; 
import { ConfigurationPage } from '../configuration/configuration'; 
import { MapPage } from '../map/map'; 
import { PassesPage } from '../passes/passes'; 
...
  tab1Root = MapPage; 
  tab2Root = PassesPage; 
  tab3Root = AstronautsPage; 
  tab4Root = ConfigurationPage; 
```

**tabs.html**
```html
  <ion-tab [root]="tab1Root" tabTitle="Maps" tabIcon="locate"></ion-tab> 
  <ion-tab [root]="tab2Root" tabTitle="Passes" tabIcon="list"></ion-tab> 
  <ion-tab [root]="tab3Root" tabTitle="Astronauts" tabIcon="people"></ion-tab> 
  <ion-tab [root]="tab4Root" tabTitle="Configuration" tabIcon="options"></ion-tab> 
```

We should now be able to navigate to our page so let's update it to deal with the configuration of our application.

The markup for our configuration page is straightforward.

```html
<ion-header> 
  <ion-navbar> 
    <ion-title>Configuration</ion-title> 
  </ion-navbar> 
</ion-header> 
 
<ion-content> 
  <ion-list> 
    <ion-item> 
      <ion-label floating>Refresh Map (Seconds)</ion-label> 
      <ion-input type="number" [(ngModel)]="refreshRate"></ion-input> 
    </ion-item> 
 
    <ion-item> 
      <ion-label floating>Address</ion-label> 
      <ion-textarea [(ngModel)]="address" (change)="addressChanged()"></ion-textarea> 
    </ion-item> 
 
    <ion-item> 
      <ion-label>Use Current Location</ion-label> 
      <ion-toggle [(ngModel)]="useLocation"></ion-toggle> 
    </ion-item> 
  </ion-list> 
</ion-content> 
```

In code, we need to read the configuration data upon entry and save it upon exit. I have put the code that saves the address changes in its own method called on a `(change)` event such that we only geo-code the address when we need to rather than with every visit.

```ts
import { Component } from '@angular/core';

import { ConfigurationProvider } from '../../providers/configuration/configuration';
import { LocationProvider } from '../../providers/location/location';

@Component({
  selector: 'page-configuration',
  templateUrl: 'configuration.html'
})
export class ConfigurationPage {
  private originalAddress: string;

  address: string;
  refreshRate: string;
  useLocation: boolean;

  constructor(
    private configuration: ConfigurationProvider,
    private location: LocationProvider
  ) {}

  ionViewDidEnter() {
    this.address = this.configuration.address;
    this.refreshRate =
      this.configuration.refreshRate &&
      this.configuration.refreshRate.toString();
    this.useLocation = this.configuration.useCurrentLocation;
    this.originalAddress = this.address;
  }

  addressChanged(): void {
    (async () => {
      this.configuration.address = this.address;
      this.configuration.position = await this.location.position(this.address);
    })();
  }

  ionViewWillLeave() {
    this.configuration.refreshRate =
      this.refreshRate && parseInt(this.refreshRate);
    this.configuration.useCurrentLocation = this.useLocation;
  }
}
```

We also need to add a `position` method to the `location` service in order to geocode a position from an address string:

```ts
  position(address: string): Promise<Position> { 
    return new Promise(resolve => { 
      this.geocoder.geocode({ address: address }, (results, status) => { 
        if (status === 'OK' && results[0]) { 
          resolve({ 
            latitude: results[0].geometry.location.lat(), 
            longitude: results[0].geometry.location.lng() 
          }); 
        } else { 
          resolve(this.defaultPosition); 
        } 
      }); 
    }); 
  } 
```

**Note:** we currently have a private property called `position`. Use your editor's refactoring tools to rename that property to `_currentPosition` first.

#### Using the Configuration

Now we just need to update the map page and the passes page to respect the configuration. Only the important bits of these changes are included here. See the diffs for this step's commit if you get stuck on the surrounding changes.

In the map page, rather than having a hard-coded refresh rate, we use the one from the configuration. Remember to inject the configuration provider.


```ts
  async ionViewDidEnter() { 
    this.showLocation(); 
    await this.configuration.init(); 
    this.interval = setInterval( 
      this.showLocation.bind(this), 
      this.configuration.refreshRate * 1000 
    ); 
  } 
```

For the passes page, we do not have to change the component at all. Rather, we need to modify the `location` provider to provide the correct position based on the configuration.

```ts
  async currentPosition(): Promise<Position> { 
    await this.configuration.init(); 
    if (this.configuration.useCurrentLocation && 'geolocation' in navigator) { 
      return await this.getCurrentPosition(); 
    } else { 
      return this.configuration.position || this.defaultPosition; 
    } 
  } 
 
  private getCurrentPosition(): Promise<Position> { 
    return new Promise(resolve => { 
      navigator.geolocation.getCurrentPosition(p => { 
        if (p.coords) { 
          this._currentPosition.latitude = p.coords.latitude; 
          this._currentPosition.longitude = p.coords.longitude; 
        } 
        resolve(this._currentPosition); 
      }); 
    }); 
  } 
```

## Step #9 - Fix Usage on Device (iOS Only)

When we load the application onto an Android device and run it, everything works well. This first time we go to the "Passes" tab it will ask if we would like to allow the app to get our current location. If we allow it (which we better do since we didn't code for not allowing it), the device will grab our current location and display the pass data. On subsequent visits to the same tab, the device just gets the location (it doesn't have to ask us for permission again).

On iOS, we have a different story. The first time we go to the "Passes" page, the application just sits there. If we look at the console in Xcode, we see the following message:

```
[Warning] No NSLocationAlwaysUsageDescription or NSLocationWhenInUseUsageDescription key is defined in the Info.plist file.
2017-12-27 15:34:02.356954-0600 ISSTracker[4096:2822107]
```

Let's try fixing that and see what happens.

### Details

We do not want to be messing with the iOS build files after they are generated:

- any adjustments we make to them will get overwritten the next time they are rewritten
- any adjustments we make to them will not get transferred cleanly to a CI server or to Ionic Pro's build system

Instead, we want to add an entry to the `config.xml` file that will result in the property being set properly when the build files are generated. Open the `config.xml` file and add the following lines right before the `<platform name="android">` section.

```xml
<config-file parent="NSLocationWhenInUseUsageDescription" platform="ios" target="*-Info.plist"> 
  <string>Used to determine where to get passes</string> 
</config-file> 
```

If we perform `ionic build` and then use Xcode to rebuild and reinstall our application it behaves properly now. That is, on the first visit to the "Passes" page, it asks the user to allow the application to access the current location, including the `NSLocationWhenInUseUsageDescription` in the alert. If the user allows it, the page will show the current address and a list of passes. Just like on Android, the question is only asked on the first visit to the page.kkkkj

## Step #8 - Current Location

### Overview

In this step, we will:

- check [https://whatwebcando.today]()https://whatwebcando.today) to see how well supported Geolocation is supported
- implement web API based geolocation and try running on a device
- use reverse geocoding to get the current address
- use a pipe to display the address in a nice manner
- add a waiting indicator

### Details

First let's check [https://whatwebcando.today](https://whatwebcando.today) and see how well Geolocation is supported. It appears that it is supported well enough in all current browsers, so let's try using the web API directly.

#### Create a Provider

The first step is to create a location service: `ionic g provider location`

This provider will perform two tasks:

- currentPosition() - get the our current position
- address() - use [reverse geocoding](https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse) to get an approximate address for our location

Here is the code that gets the current location:

```ts
  currentPosition(): Promise<Position> {
    if ('geolocation' in navigator) {
      return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(p => {
          if (p.coords) {
            this.position.latitude = p.coords.latitude;
            this.position.longitude = p.coords.longitude;
          }
          resolve(this.position);
        });
      });
    } else {
      return Promise.resolve(this.defaultPosition);
    }
  }
```

The code that does the reverse geocoding is also fairly straightforward:

```ts
  address(position: Position): Promise<Address> {
    const latLng = new google.maps.LatLng(
      position.latitude,
      position.longitude
    );
    return new Promise(resolve => {
      this.geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(this.buildAddress(results[0].address_components));
        } else {
          resolve({ streetNumber: 'Unknown Address' });
        }
      });
    });
  }
```

But what is this: `this.buildAddress(results[0].address_components)`?

Rather than giving us a record for an address, Google gives us an array of fields that each have a value and an array of types that defined what the field means. This has a couple of disadvantages:

- it makes displaying the address more difficult
- the format could change, new types could be added, etc. making our code potentially fragile
- we could switch to a different service that returns the address in a completely different format

For these reasons, it makes sense for us to define our own interface and convert our data from Google's format to our own. In this way, if anything changes, we only have to change how our provider translates the data to our interface instead of changing a lot of other code throughout the system.

It is generally a good idea to build an abstraction layer like this between portions of your system, even if the abstraction layer is very thin. Here is the code for our abstraction:


```ts
  private buildAddress(fields): Address {
    return fields.reduce((acc, curr) => {
      const field = this.fieldName(curr.types);
      if (field) {
        acc[field] = curr.short_name;
      }
      return acc;
    }, {});
  }

  private fieldName(t: Array<string>): string {
    if (t.indexOf('street_number') > -1) {
      return 'streetNumber';
    }
    if (t.indexOf('route') > -1) {
      return 'street';
    }
    if (t.indexOf('locality') > -1) {
      return 'city';
    }
    if (t.indexOf('administrative_area_level_1') > -1) {
      return 'area';
    }
    if (t.indexOf('postal_code') > -1) {
      return 'postalCode';
    }
  }
```

#### Displaying the Address

We want to display the data on the top of the list of passes so we know what location is associated with the list. We could just display each element and try to do some reasonable formatting in the view itself. Rather than do that, we will create a couple of pipes. Using a pipe to format the data has a couple of advantages:

- the markup is much cleaner
- they are very easily tested (when we have unit tests) 

For simplicity, we will create a single pipe that will take a parameter that specifies exactly what data is displayed: `ionic g pipe address`

Here is the code:

```ts
import { Pipe, PipeTransform } from '@angular/core';

import { Address } from '../../models/address';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {
  transform(value: Address, format: string): string {
    if (!value) {
      return '';
    }

    switch (format) {
      case 'line1':
        return `${value.streetNumber}${
          value.streetNumber && value.street ? ' ' : ''
        }${value.street}`;

      case 'line2':
        let rtn = value.city;
        if (value.area) {
          rtn += rtn && ', '
          rtn += value.area;
        }
        if (value.postalCode) {
          rtn += rtn && ' '
          rtn += value.postalCode;
        }
        return rtn;

      default:
        return '';
    }
  }
}
```

Let's use the pipe in `passes.html`:

```html
    <ion-item>
      <div class="title">
        Address:
      </div>
      <div>
        {{this.address | address: 'line1'}}
      </div>
      <div>
        {{this.address | address: 'line2'}}
      </div>
    </ion-item>
```

**Note:** when we created the pipe, a pipe module was created. Be sure to import that module in the App module.

#### Miscellaneous Cleanup

While we are using pipes to make things pretty, let's use the pre-defined [date pipe](https://angular.io/api/common/DatePipe) to make the pass data more readable.

```html
    <ion-item *ngFor="let pass of passes">
      {{pass.riseTime | date: 'EEE, MMM d, y, h:mm:ss a'}}
    </ion-item>
```

#### And we Wait...

You will notice that it now takes a non-trivial amount of time to display the passes. This is mostly because of the time it takes to get the current location. We should provide the user with some kind of indication that the application is doing something. We will use the [LoadingController](https://ionicframework.com/docs/api/components/loading/LoadingController/) to provide this.

**page.ts**

```ts
import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';
import { Address } from '../../models/address';
import { Pass } from '../../models/pass';
import { LocationProvider } from '../../providers/location/location';

@Component({
  selector: 'page-passes',
  templateUrl: 'passes.html'
})
export class PassesPage {
  address: Address;
  passes: Array<Pass>;

  constructor(
    private data: IssTrackingDataProvider,
    private loadingCtrl: LoadingController,
    private location: LocationProvider
  ) {}

  async ionViewDidEnter() {
    const loading = this.loadingCtrl.create({
      content: 'Loading passes for this location...'
    });
    loading.present();
    const position = await this.location.currentPosition();
    this.data
      .nextPasses(position)
      .subscribe(p => (this.passes = p));
    this.address = await this.location.address(position);
    loading.dismiss();
  }
}
```

**Note:** there is a bug in the above code. Do you see it? Look closely at the `ionViewDidEnter()` method. The call to `this.data.nextPasses()` is asynchronous and could take a really long time. This would result in the loading indicator being dismissed before the pass data came back.

It is certainly a problem, but it will not affect us right now because those calls are so fast. Still, we should think about how to fix that. We can discuss that at a later time. It is not currently causing an issue.

## Step #7 - Try it on Mobile

Now would be a good time to try running the application on some devices to make sure everything works well.

### Overview

In this step, we will:

- give the application a name
- give the application a nice icon and splash screen
- build the application
- run the application on iOS 
- run the application on Android 
- use a better color for the status bar on Android

### Details

Up to now, our application has been named `MyApp`, which is the default upon creation. This issue does not really make itself known until we install the application on a device and see that it is titled `MyApp` and that it has the default Ionic application icon and splash screen. Let's fix all of that.

#### Renaming the Application

To give the application a better name, open the `config.xml` file and change the `name` and `description` information. You may also want to change the `author` information since you are very likely not us.

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="io.ionic.starter" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>ISSTracker</name>
    <description>Tracks the Location of the International Space Station</description>
    <author email="hi@ionicframework" href="http://ionicframework.com/">Ionic Framework Team</author>
```

Take a moment to look at the rest of this file. This is where a lot of Cordova related options are set. Some of this file is maintained automatically when certain Ionic CLI commands are run, but other times you may need to come in here to change some default settings. It is a good idea to familiarize yourself with this file a bit.

#### Icons and Splash Screens

If you look in the `resources` folder, you will find an `icon.png` and a `splash.png` file along with a `README.md` file that has links to the appropriate Cordova documentation. To create a custom icon and splash screen for your application:

1. create an `icon.png` that is 1024x1024 pixels in size, replace `resources/icon.png`
1. create an `splash.png` that is 2732x2732 pixels in size, replace `resources/splash.png`
1. run `ionic cordova resources`

The `ionic cordova resources` command uploads your `icon.png` and `splash.png` to an Ionic server where they are processed into the various sizes required for the supported devices and then downloaded. This command requires that you log in using your Ionic account. You should only need to do the login once.

**Note:** The above sizes are minimum sizes and are subject to change as new devices are released. You can make the images larger, but you might have scaling issues. The splash screen will be cropped and scaled, so it is best to put any logos or other images in the center.

#### Build the Application

There are multiple ways to build the application, and it depends on what you want the output to be:

- `ionic build`
- `ionic cordova build ios`
- `ionic cordova build android`

I usually use the first as the extra stuff done by the other two is not necessary until an actual deployment, and that can be done at that time.

All of these commands take various options, including `--prod` (all three) and `--release` (only the last two)

#### Running the Application on a device

There are two ways to run an application on a device:

- use the appropriate IDE
- use the `ionic cordova run` command

##### Running the Application on iOS

Usually, I choose to use the IDE for running an iOS application on a device. To do this for our project:

```bash
$ open platforms/ios/ISSTracker.xcodeproj
```

This will open Xcode, from which you can set up the signing of the application, pick a device or sim to run the application on, and launch the application. 

You can also use `ionic cordova run ios` to run your application on a connected device (or in a simulator if no device is connected). I find that the tools that Cordova requires in order to support this can be flakey so I tend not to use this method.

##### Running the Application on Android

For running the application on one of my Android devices, I usually choose to use the command line: `ionic cordova run android`. This command usually works well.

Another option is to use Android Studio to open the `<app>/platforms/android` folder and then run the application from there. This puts a lot of options at your finger tips, but it can also be slow.

##### Debugging the Application

While the application is running, you can connect to it via Safari (for iOS) or Chrome (for Android) to monitor and debug it if you need to. For more information on using a browser to debug your applications, see [our helpful guide](https://ionicframework.com/docs/developer-resources/developer-tips/)

#### Styling the Status Bar on Android

If you ran your application on Android, you may have noticed that the status bar does not really blend in with the application. As a matter of fact, depending on the version of Android, the color could be downright ugly in combination with the purple header we have. Let's fix that.

On iOS, the color of the status bar is the same as the color of the header of the application. The Android application guidelines call for the status bar to be a different color than the application's header. We certainly have that, but let's pick a different color that matches better, and let's only do that for Android.

The color I picked is just a darker shade of purple. It looks nice and it creates the differentiation that the style guide is looking for. Change the code in `app.component.ts` to set it if we are on the Android platform.

```ts
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();
      if (platform.is('android')) {
        statusBar.backgroundColorByHexString('#520E7A');
      }
    });
```

Since the new background is dark, I am also using the `statusBar.styleLightContent();` to make the icons shown in the status bar lighter. That applies to both iOS and Android.

But wait. When I rebuild and run the application on Android I still have the old ugly status bar. What is going on?

You can use Chrome on your computer to connect remotely to the application running on the device. When you do this, you will see some warnings in the console about not having the `cordova-plugin-statusbar` plugin installed. What is happening is that we have `@ionic-native/status-bar` installed. However, that is just a wrapper around the actual plug-in, and it provides us with a helpful warning if we try to do anything to the status bar without the actual plugin installed. For more information on what the Ionic Native plugin wrappers get you, see [the documentation](https://ionicframework.com/docs/native/).

To install the plugin: `ionic cordova plugin add cordova-plugin-statusbar`

Now when you rebuild and run the application on an Android device you should see the nicely colored status bar.


## Step #6 - Where's the ISS?

Right now the map is pretty much pinned to Ionic HQ. Let's change that so we can see where the International Space Station is right now.

### Details

## Step #6 - Where's the ISS? 
 
Right now the map is pretty much pinned to Ionic HQ. Let's change that so we can see where the International Space Station is right now. 
 
### Overview 

In this step, we will modify the map page to:

- get the current location of the International Space Station and create the map centered there
- update the map as the space station moves
 
### Details 

#### Creating the Map

We are already creating the map when we load the view. Let's modify the `createMap()` method to take a position, and then pass in the current position of the space station. Here are the changes.

```ts
...
import { Position } from '../../models/position';
... 
  ionViewDidLoad() {
    this.data.location().subscribe(p => {
      this.createMap(p);
    });
  }
...
  private createMap(pos: Position) {
    this.map = new google.maps.Map(
      document.getElementById('iss-tracking-map'),
      {
        center: new google.maps.LatLng(pos.latitude, pos.longitude),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(pos.latitude, pos.longitude),
      map: this.map,
      animation: google.maps.Animation.DROP
    });
  }
}
```

#### Moving the Map

That's all well and good, but the space station moves (fast) and it would be nice to see it moving. Let's set up an interval to re-check the location and pan the map. Here are the changes to `map.ts`:

```ts
  private interval: number;
  ...
  ionViewDidEnter() { 
    this.interval = setInterval(() => { 
      this.data.location().subscribe(p => { 
        this.map.panTo(new google.maps.LatLng(p.latitude, p.longitude)); 
        this.marker.setPosition(new google.maps.LatLng(p.latitude, p.longitude)); 
      }); 
    }, 10000); 
  } 
 
  ionViewDidLeave() { 
    clearInterval(this.interval); 
  } 
```

So now on `ionViewDidLoad`, we create the map, and then on `ionViewDidEnter` we set up an interval to recheck the location every 10 seconds. We use the `ionViewDidLeave` lifecycle hook to clear the interval when we leave the page.

#### Final Cleanup

That is all well and good, but we still have an issue. If we leave the page and then come back, we have to wait a full 10 seconds for a refresh. It would be nice if that happened right away.

To accomplish this, we will refactor the code such that it will either create or pan the map depending on whether or not a map currently exists. We will then only use the `ionViewDidEnter` hook to get data and draw the map. It can do that when we first enter the page and set up an interval to do it every 10 seconds after that. This means we no longer need the code in our `ionViewDidLoad` hook, so we will remove that. Here is the full code:

```ts
import { Component } from '@angular/core';

import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';
import { Position } from '../../models/position';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  private interval;
  private map;
  private marker;

  constructor(private data:IssTrackingDataProvider) {}

  ionViewDidEnter() {
    this.showLocation();
    this.interval = setInterval(this.showLocation.bind(this), 10000);
  }

  ionViewDidLeave() {
    clearInterval(this.interval);
  }

  private showLocation() {
    this.data.location().subscribe(p => {
      if (this.map) {
        this.moveMap(p);
      } else {
        this.createMap(p);
      }
    })
  }

  private createMap(pos: Position) {
    this.map = new google.maps.Map(
      document.getElementById('iss-tracking-map'),
      {
        center: new google.maps.LatLng(pos.latitude, pos.longitude),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(pos.latitude, pos.longitude),
      map: this.map,
      animation: google.maps.Animation.DROP
    });
  }

  private moveMap(pos: Position) {
    this.map.panTo(new google.maps.LatLng(pos.latitude, pos.longitude));
    this.marker.setPosition(new google.maps.LatLng(pos.latitude, pos.longitude));
  }
}
```

**Note:** when `this.showLocation` is passed to `setInterval` like that, the `this` pointer ends up being messed with. There are a couple of ways to deal with this. We chose to bind the proper "this" as such `this.interval = setInterval(this.showLocation.bind(this), 10000);` but that could have also been written as:

```ts
this.interval = setInterval(() => this.showLocation(), 10000);
```

Both are totally valid. Do whichever you like best.

## Step #5 - Displaying Data

Now that we are getting some data, let's display some of it on the pages

### Overview

In this step, we will:

- inject the data provider in the pages
- show the difference between `ionViewDidLoad` and `ionViewDidEnter` 
- load data when two of the views enter
- display the data in the list views
- adjust the data service due to issues that were found

### Details

#### Injecting the Data Provider

First, we need to make the data provider available in the pages. This is done by injecting it using Angular's Dependency Injection. The provider was already made available for injection when we added it. This was done by listing it as a provider in `app.module.ts`. To inject the provider, include it in each page's constructor.

```ts
import { Component } from '@angular/core'; 
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data'; 
 
@Component({ 
  selector: 'page-passes', 
  templateUrl: 'passes.html' 
}) 
export class PassesPage { 
  constructor(private data: IssTrackingDataProvider) {} 
} 
```

#### Lifecycle Events

Let's have a look at a couple of lifecycle events: `ionViewDidLoad` and `ionViewDidEnter`. To do this, add a method for each event each page such as below (not that `ionVewDidLoad` is already implemented in `map.ts`, just update that file):

```ts
import { Component } from '@angular/core'; 
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data'; 
 
@Component({ 
  selector: 'page-passes', 
  templateUrl: 'passes.html' 
}) 
export class PassesPage { 
  constructor(private data: IssTrackingDataProvider) {} 
 
  ionViewDidLoad() { 
    console.log('I have loaded the passes view'); 
  } 
 
  ionViewDidEnter() { 
    console.log('I have entered the passes view'); 
  } 
} 
```

If you run the application with the console open you will see that `ionViewDidLoad` is only called the first time you click on a tab where-as `ionViewDidEnter` is called each time. That is because the pages are cached and thus not loaded each time.

#### Displaying the Data

In this step, we will display `pass` and `astronaut` data. Furthermore, we want to re-select the data each time the pages is entered. In order to do this, we will modify the `ionViewDidEnter` method to get the data. We will also remove the `ionViewDidLoad` method as it is not needed:

**astronauts.ts**
```ts
import { Component } from '@angular/core';
import { Astronaut } from '../../models/astronaut';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';
 
@Component({
  selector: 'page-astronauts',
  templateUrl: 'astronauts.html'
})
export class AstronautsPage {
  astronauts: Array<Astronaut>;
 
  constructor(private data: IssTrackingDataProvider) {}
 
  ionViewDidEnter() {
    this.data.astronauts().subscribe(a => this.astronauts = a);
  }
}
```

**passes.ts**
```ts
import { Component } from '@angular/core';
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';
import { Pass } from '../../models/pass';
 
@Component({
  selector: 'page-passes',
  templateUrl: 'passes.html'
})
export class PassesPage {
  passes: Array<Pass>;
 
  constructor(private data: IssTrackingDataProvider) {}
 
  ionViewDidEnter() {
    this.data.nextPasses({ latitude: 43.074237, longitude: -89.381012 }).subscribe(p => this.passes = p);
  }
}
```

Once the data is obtained, we can display it on the page:

**astronauts.html**
```html
<ion-header>
  <ion-navbar>
    <ion-title>
      Astronauts
    </ion-title>
  </ion-navbar>
</ion-header>
 
<ion-content padding>
  <ion-list>
    <ion-item *ngFor="let astronaut of astronauts">
      {{astronaut.name}}
    </ion-item>
  </ion-list>
</ion-content>
```

**passes.html**
```html
<ion-header>
  <ion-navbar>
    <ion-title>
      Passes
    </ion-title>
  </ion-navbar>
</ion-header>
 
<ion-content padding>
  <ion-list>
    <ion-item *ngFor="let pass of passes">
      {{pass.riseTime}}
    </ion-item>
  </ion-list>
</ion-content>
```

#### Fixing the Data Provider

When we update the `passes` page, we notice that nothing is displayed. Looking more closely at the data provider, we see the following issues:

- we are just unpacking the `response`, which has a `duration` property and a `risetime` property (note the lower case `t` where our model has `riseTime` with an upper case `T`)
- the `risetime` is the number of seconds since the epoch, not a Date, we want to display a date
- riseTime is defined as a number, not a Date in our model

Let's fix all of that.

First our model:

```ts
export interface Pass {
  duration: number;
  riseTime: Date;
}
```

Now let's transform the data properly in our data service:

```ts
  nextPasses(position: Position): Observable<Array<Pass>> {
    return this.http.jsonp(`${this.baseUrl}/iss-pass.json?lat=${position.latitude}&lon=${position.longitude}`, 'callback').pipe(
      map(res => {
        const data = (res as any).response.map(r => ({
          duration: r.duration,
          riseTime: new Date(r.risetime * 1000)
        }));
        return data;
      })
    );
  }
```

Key points here are:

- within the rxjs `map` operator, we use `Array.map` to map each element in the `response`
- the `risetime` is in seconds not milliseconds, so we need to multiply by 1000 before converting to a date

While we are in the code, let's also clean up `map.ts`:

- remove the lifecycle event test code we just added
- remove the code that calls and logs each method on the data provided (test code from the previous step)
- remove the injection of the nav controller
- change the name of the data provider from `tracking` to `data`


## Step #4 - Creating a Provider

We need to get information about the International Space Station. We will get this information from some [Open Notify](http://open-notify.org/) feeds. We _could_ put this code directly in the pages that need it. However, in order to maintain proper separation of concerns, we _should_ put this code into a service that handles the data acquisition. Doing this makes our application more testable and maintainable.

### Overview

In this step, we will:

- Use the Ionic CLI to create an Ionic Provider (Angular Service)
- Use that provider to get data from http://open-notify.org/

### Details

#### Create the Provider

First, let's generate the shell of a provider:

```bash
$ ionic g provider iss-tracking-data
```

This command creates a shell data provider called `IssTrackingDataProvider` in `src/providers/iss-tracking-data/iss-tracking-data.ts` and adds it to the `providers` list in `src/app/app.modult.ts`.

If we were to try an inject this provider right now, however, Angular would get angry with us, giving us an error such as:

```
  StaticInjectorError[HttpClient]: 
    NullInjectorError: No provider for HttpClient!
```

That is because our `IssTrackingDataProvider` depends on `HttpClient` and we are not importing that module anywhere. We have several choices:

1. create a module for our `IssTrackingDataProvider` and import `HttpClientModule` there, but this is not generally a good idea if we will have multiple data providers as they will all need `HttpClientModule` and we do not want to create multiple instances of the `HttpClient` service
1. create a module for all of our data related providers, import `HttpClientModule` there and then import/export all of our providers from that module. This is not a bad idea, and could work well.
1. add `HttpClientModule` to the `AppModule` - this is also a good option and one we will adopt here

**app.module.ts**
```ts
import { HttpClientModule } from '@angular/common/http';

...

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
    IonicModule.forRoot(MyApp)
  ],
...

```

#### Creating Models

It is a good idea to model the data we want to get from http://open-notify.org/ so we will create a `src/models` folder and add the following interfaces:

**astronaut.ts**
```ts
export interface Astronaut {
  craft: string;
  name: string;
}
```

**pass.ts**
```ts
export interface Pass {
  duration: number;
  riseTime: number;
}
```

**position.ts**
```ts
export interface Position {
  latitude: number;
  longitude: number;
}
```

#### Getting the Data

Let's try this code for getting the data:

```ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { Astronaut } from '../../models/astronaut';
import { Pass } from '../../models/pass';
import { Position } from '../../models/position';

@Injectable()
export class IssTrackingDataProvider {
  private baseUrl = 'http://api.open-notify.org';

  constructor(private http: HttpClient) { }

  location(): Observable<Position> {
    return this.http.get(`${this.baseUrl}/iss-now.json`).pipe(
      map(res => (res as any).iss_position as Position)
    );
  }

  nextPasses(position: Position): Observable<Array<Pass>> {
    return this.http.get(`${this.baseUrl}/iss-pass.json?lat=${position.latitude}&lon=${position.longitude}`).pipe(
      map(res => (res as any).response as Array<Pass>)
    );
  }

  astronauts(): Observable<Array<Astronaut>> {
    return this.http.get(`${this.baseUrl}/astros.json`).pipe(
      map(res => (res as any).people as Array<Astronaut>)
    );
  }
}
```

Let's test this by adding the following code to `map.ts`:

```ts
import { IssTrackingDataProvider } from '../../providers/iss-tracking-data/iss-tracking-data';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  private map;
  private marker;

  constructor(private navCtrl: NavController, private tracking:IssTrackingDataProvider) {}

  ionViewDidLoad() {
    this.createMap();
    this.tracking.location().subscribe(x => console.log('location', x));
    this.tracking.astronauts().subscribe(x => console.log('astronauts', x));
    this.tracking.nextPasses({ latitude: 43, longitude: -89 }).subscribe(x => console.log('passes', x));
  }

...
```

If we look at the console, we see we have CORS issues with the `nextPasses()` call.


#### Fixing the CORS Issues

Normally at this point, we would need to contact the developers who wrote our data service and work with them to get this resolved. In this case, however, we don't have that ability. 

To get around this, we will use a JSONP request for the passes data. In order to do this, we will need to:

1. add the `HttpClientJsonpModule` to `AppModule`
1. change the call from a `get()` to a `jsonp`, specifying the name of the callback parameter (which according to [the documentation for our data feed](http://open-notify.org/Open-Notify-API/ISS-Pass-Times/)) is `callback`

**app.module.ts**
```ts
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

...

  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IonicModule.forRoot(MyApp)
  ],

...
```

**iss-tracking-data.ts**
```ts
  nextPasses(position: Position): Observable<Array<Pass>> {
    return this.http.jsonp(`${this.baseUrl}/iss-pass.json?lat=${position.latitude}&lon=${position.longitude}`, 'callback').pipe(
      map(res => (res as any).response as Array<Pass>)
    );
  }
```

Now all three routines return data.

## Step #3 - Add the Map

Our first page will eventually display a map showing the current location of the International Space Station. At the end of this step, the main page will display a map with a simple marker displaying a pre-defined location to show that the mapping is working.

### Overview

In this step, we will:

- Generate an API key
- Include the Google Maps APIs
- Draw the map
- Add a marker

This step introduces the idea of lifecycle events as well as the use of alternate styles depending on the platform (iOS or Android).

### Details

#### Generating an API Key

In order to complete this step, you need to:

1. go to https://console.developers.google.com/apis/dashboard
1. enable the Google Maps Geocoding API
1. enable the Google Maps JavaScript API
1. go to https://console.developers.google.com/apis/credentials
1. generate an API key to use for this application

**Note:** The way we are using the API key in this demo is inherently insecure. In production code, you want to be more secure. Securing the key is beyond the scope of this lab.

**Note:** If you are doing this lab as part of an Ionic training course, we can supply a code for you to use. However, this API key will very likely be regenerated shortly after the course making the one we gave you invalid. At that point, if you want to continue using this lab you will need to generate your own key.

#### Adding the Map

1. `npm i @types/googlemaps --save` - installs the google maps API TypeScript type definitions
1. update `index.html` to load the google apis script: `<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"></script>` - add this to the end of the `<body>`.
1. update the Map page to display a map
   1. add a `<div>` to `map.html` to display the map
   1. style the `<div` such that the map displays at the proper size
   1. create the map after the view loads (use the `ionViewDidLoad` lifecycle event, see the [NavController](https://ionicframework.com/docs/api/navigation/NavController/) documentation for details

**map.html**
```html
<ion-header>
  <ion-navbar>
    <ion-title>Home</ion-title>
  </ion-navbar>
</ion-header>

<ion-content>
  <div id="iss-tracking-map"></div>
</ion-content>

```

**map.scss**
```scss
page-map {
  .content-md {
    #iss-tracking-map {
      height: calc(100vh - 112px);
    }
  }

  .content-ios {
    #iss-tracking-map {
      height: calc(100vh - 93px);
    }
  }
}
```

**map.ts**
```ts
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  private map;
  private markers;

  constructor(private navCtrl: NavController) { }

  ionViewDidLoad() {
    this.createMap();
  }

  private createMap() {
    this.map = new google.maps.Map(
      document.getElementById('iss-tracking-map'),
      {
        center: new google.maps.LatLng(43.074237, -89.381012),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(43.074237, -89.381012),
      map: this.map,
      title: 'Ionic HQ',
      animation: google.maps.Animation.DROP
    });
  }
}
```

## Step #2 - Layout

Our application looks a lot like what we want for the ISS tracker in that it has three tabs, but the UI is a little drab, the pages do not have the correct names, and the icons are wrong. Let's fix that.

### Overview

In this step, we will:

- Make a simple change to the style
- Update the icons used for the tabs
- Rename the tabs
- Rename the pages in code

### Details

#### Changing Style

The style of your application can be adjusted in a few ways:

- adjust the basic style parameters in `src/theme/variables.scss`
- adjust the global styling via `src/app/app.scss`
- adjust the local styling via an individual page or component's `scss` file

For this lab, we will use a slightly nicer color for the header. Do do this, update the `src/theme/variables.sccs` file as such:

```sass
$colors: (
  header:     #6a1b9a,   // add this line
  primary:    #488aff,
  secondary:  #32db64,
  danger:     #f53d3d,
  light:      #f4f4f4,
  dark:       #222
);

$toolbar-background: color($colors, header);   // and this line
```

#### Updating the Icons and Renaming the Tabs

The starter application contains three fairly generic pages. Our application uses none of these. To make our tab names and icons more applicable to the function of our application:

1. open the `src/pages/tabs/tabs.html` file
1. update the `tabTitle` and `tabIcon` properties on each tab as follows:

```html
<ion-tabs>
  <ion-tab [root]="tab1Root" tabTitle="Maps" tabIcon="locate"></ion-tab>
  <ion-tab [root]="tab2Root" tabTitle="Passes" tabIcon="list"></ion-tab>
  <ion-tab [root]="tab3Root" tabTitle="Astronauts" tabIcon="people"></ion-tab>
</ion-tabs>
```

### Renaming the Pages in the Code

At this point, there is a disconnect between the name of our pages in the code and the function that is targetted for each page. Let's fix that. This is basically a brute force operation.

For the items being renamed, be sure to rename all files within the folder and modify any class names, etc. to make sense.

- `src/pages/about` -> `src/pages/passes`
- `src/pages/contacts` -> `src/pages/astronauts`
- `src/pages/home` -> `src/pages/map`
- `src/pages/tab/tabs.ts` - change references
- `src/app/app.module.ts` - change references

## Step #1 - Getting Started

The first step is to create the application, update the dependencies, and install the platforms that you will be targetting. For this lab, we will assume you will be targetting both iOS and Android, but if that is not the case you are free to only install one or the other.

### Overview

- `ionic start lab-iss-tracker tabs`
- `cd lab-iss-tracker`
- `ionic serve`

- `npm outdated`
- edit `package.json` to update some dependecies (see below)
- `npm i`

The following steps are optional and should only be performed if you have already set up your machine to build iOS and/or Android applications. Doing so is beyond the scope of this lab.

- `ionic cordova platform add ios`
- `ionic cordova platform add android`

### Details

The `ionic start lab-iss-tracker tabs` command will generate a new Ionic application using our tabs starter. Be sure to run this command where it will not interfere with the repo you are reading now.

Once the command finishes, you can `cd` into the newly created directory and use `ionic serve` to run the application in the browser. The `ionic serve` command will build the application, start a development web server, and serve up the application in your default browser. The process will then watch for changes and rebuild the application as you make them.

The first task we would like to do is to check and see if any of our libraries are outdated. If we run `npm outdated` we should see that indeed the Angular libraries and a few others are outdated. Some of these are safe to update, some are not. Knowing what is compatible and what is not can be tricky. For now, just update the `package.json` file as such and run `npm i` (short for `npm install`) to install the updates.

```
    "@angular/common": "~5.1.0", 
    "@angular/compiler": "~5.1.0", 
    "@angular/compiler-cli": "~5.1.0", 
    "@angular/core": "~5.1.0", 
    "@angular/forms": "~5.1.0", 
    "@angular/http": "~5.1.0", 
    "@angular/platform-browser": "~5.1.0", 
    "@angular/platform-browser-dynamic": "~5.1.0", 
    "@ionic-native/core": "~4.5.0", 
    "@ionic-native/splash-screen": "~4.5.0", 
    "@ionic-native/status-bar": "~4.5.0",
    ...
    "rxjs": "~5.5.2",
    ...
```

**Note:** the `~` (tilde) tells npm that we will accept bug fix releases to the package, meaning that if there is a `@angular/common` version `5.1.3` we will take it, but not a `5.2.0`. If you see a `^`, the meaning is similar but will allow updates to the minor version. That is, it would take `5.2.0` but not `6.0.0` in the above scenario.

The final step is to add the platforms that you are going to use. This allows you to build for your iOS and Android devices, emulate the devices on your development machine, and install development versions of the applications to physical devices. This will only work if you have the proper development tools and SDKs already installed on your system. Doing that is beyond the scope of this lab. You can skip adding these platforms if you wish.
