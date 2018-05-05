# Ionic v4 Migration

The end product of this lab was migrated from Ionic v3 to Ionic v4. The lab steps themselves as represented in this repository were not changed. The labs that are actuall presented in training will need to be reverse engineered to work with version 4 of Ionic.

This article documents the steps that were taken in order to migrate the application to Ionic v4. This may be used as a guide when helping our clients migrate their applications. Here are the general steps:

1. Create a fresh starting point
   1. Use three seperate folders
      1. Create a new branch on the existing project, this is the working branch, all work is done here
      1. Generate an Ionic v4 tabs project, this is the new starting point
      1. Clone the existing project into a new folder, this is where you grab the old code when it is time to copy it in
   1. Remove all non-hidden files in working branch
   1. Copy the project contents from the newly generated project
   1. Fix up the `package.json` and `config.xml` files
   1. Rename the tabs to match three tabs from the existing application
1. Copy the core services, shared pipes, shared components, etc.
1. Copy the pages / feature one page / feature at a time

## Create a Fresh Starting Point

The general infrastructure of Ionic projects have changed to align with Angular CLI projects. For this reason, it is best to use the stategy of using a fresh starting point and then copying the code from the existing project into the new project.

### Three Working Folders

This most effective way to do this is to use three seperate folders:

1. The existing project with a new branch emptied of all code, this is the **working branch**
1. The existing project with the latest `master` branch checked out, this is the **reference copy**
1. A newly generated project, this is the **seed project**

### Create the Working Branch

The working branch will be a branch on your existing project. You will create the branch, empty of all code, and start with a clean project.

1. `cd lab-iss-tracker` - or wherever you need to navigate to in order to be in your project's directory
1. `git checkout -b refactor/ionic-v4`
1. `rm -rf src node_modules platforms plugins *.json config.xml` (or Windows equivalent)

This get the directory ready to copy over the stuff Ionic v4 project code.

### Create the Reference Copy

The reference copy is a copy of your existing application using Ionic v3 (or v2). This is where we will grab the existing code from when it is time to start copying the existing functionallity into the new Ionic v4 application.

Do this from your project's parent directory (`cd ..` if you are in your project directory)

`git clone git@github.com:ionic-team/lab-iss-tracker.git lab-iss-tracker-ref`

### Create the Seed Project

This is the application that will be used as a model when setting up your Ionic v4 application structure.

Do this from your project's parent directory (`cd ..` if you are in your project directory)

`ionic start lab-iss-tracker-v4`

When prompted, choose Ionic v4 and the tabs starter (or whichever starter is the most appropriate for your case). I also chose to include Cordova and not to include Ionic Pro (in the end, this probably makes little difference).

### Copy the Seed Project

By copying the source from the seed project, your application will get the new structure that it needs. By coping in all of the `.json` and the `config.xml` files, it will get the other stuff that it needs.

1. `cd lab-iss-tracker`
1. `cp -R ../lab-iss-tracker-v4/src .`
1. `cp ../lab-iss-tracker-v4/*.json .`
1. `cp ../lab-iss-tracker-v4/config.xml .`
1. `cp ../lab-iss-tracker-v4/.gitignore .`
1. `npm i`
1. `ionic cordova platform add ios` - if your project had this installed before
1. `ionic cordova platform add android` - if your project had this installed before

### Perform General Cleanu

When the seed project was copied over, it probably wiped out some custom configuration that you had. Use a combination of `git diff` and your reference project to restore that configuration.

The most likely candidates are:

* `config.xml`
   * `widget/id` - this is the bundle ID for your app
   * `name`
   * `description`
   * this lab will have had custom `NSLocationWhenInUseUsageDescription`, look for other stuff like that
* `ionic.config.json`
   * `name`
   * `app_id`
   * **Note:** `type` will have changed from `ionic-angular` to `angular`, leave that change in place
* `package.json`
   * `name`
   * `version`
   * Add back any third party libraries or plugins that you may need
   * Carefully examine any other differences

Once these changes have all been made, `npm i` to get the required third party libraries.

At this point, I suggest also renaming the generated pages to match some of the first pages that will be ported. How this is done, and which pages are the most appropriate is highly dependent on the application. For this application, I did the map, passes, and astronauts pages. A lot of the work needs to be done in the code for the tabs page (the class, the HTML markup, and the routing module).

## Copy the Core Services and Shared Elements

There are two ways this can be done:

1. direct copy
1. `ionic g service foo` - then copy in the various methods, etc. 

The former will leave your code exactly as it was before, including the name of the service (`FooProvider`, for example). It is up to you to provide the item in a module.

The latter will create the shell up to the new standards (which may result in a different name for the service, for examle). This often results in a little more work in the short term, but makes things more consistent in the long term. This it the path I prefer.

## Copy Page / Feature Level Items One at a Time

For this application, I started wih the map, passes, and astronauts pages, copying over the code and markup one item at a time.

The last page to be done was the `configuration` page. For that one, I first generated the page via `ionic g page configuration`. I then cleaned things up a little to more closely resemble the pages created via the starter (hopefully this will be fixed soon and will not need to be done), and copied the code over from the reference project. This is the general procedure I suggest for the remainder of the code.

## SCSS Modifications

The largest changes to the code were related to the SCSS. Here is an overview:

1. theming was largely accomplished via CSS variables instead of SASS variables
1. global styling was moved from `app.scss` into a `global.scss` file
1. pages and components use emulated shadow DOM by default, so there is no longer a need to wrap the styling in the element tag
