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
