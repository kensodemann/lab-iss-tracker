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
