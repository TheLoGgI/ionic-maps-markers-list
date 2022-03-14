# Travel Planning App

> A simple travel planning app, set markers of locations you want to visit. Add them to your list with dates, location and address. Remove them, update them and share them. Take pictures on your trip and post them for your location

In previous projects, I worked with Google Maps to make directions for a Mail Route (Find code on Github). Wanting to do more with Google Maps and have to make a CRUD application. The Travel Planning App seems to be a nice fit for that.

Previous names for the app was

- Locations associated with your friends
- Treasure hunting game
- Super Creepy Address Book

I have not been focusing on the design. So most of the components are Ionic with their default behavior. But before starting the process I did sketch out ideas about the app.

I knew I had to have a tab with the map, making the map part of another tab, would be too small and inconvenient. The main feature of the app is to set markers on the map, so making it the main feature and giving it space made the most sence.

Starting out as something else I had to have a list of my markers. For managing and showing results.
[Xd Wireframe](https://xd.adobe.com/view/d66b11ca-a67b-48e6-aa09-38fe9b00422b-8338/)

## Project structure

In this project, I took inspiration from the Ionic Conference App. Where they use a (state) store a.k.a a state Mangere where they do all sorts of fancy stuff. I Simplified that and went with a simpler useReducer function exporting the state and the dispatch methods.
I think this was quite nice for an app this size since all data is in one place and I am using it the same way. Making reducer functions to incorporate each “entry”.

Creating pages from smaller components implementing hooks and functions to develop each component. The Map component begins the center of attention for implementing all of the logic for the map. Hereby also updating local storage on the device to make the app work offline and more coherent.

Likewise, the store implementation is also only in one component. Exporting a hook to expose the dispatch and state. Also writing state from local storage to the state store.

It was had keeping track of all of the different states

**Root**

- public
- src
  - components
  - hooks
  - pages
  - store
  - theme
- .env
- readme.md
- package.json
- tailwind.config.js
- tsconfig.json

## Run the app

### For Web

Live version [Ionic travler](http://ionic-travler.lasseaakjaer.com/map)

### For android

Download the project from GitHub: [TheLoGgI/ionic-maps-markers-list](https://github.com/TheLoGgI/ionic-maps-markers-list)

- Run `npm install` in the project folder to install all node dependensies
- Run `npm run build` for building a version to android.
- Run `npm run dev:android` for opening the project in the android studio
  - If android studio not installed Install [Android Studio](https://developer.android.com/studio/install)
  - You also need the [Java JDK](https://www.oracle.com/java/technologies/downloads/) for building the app in the android studio
  - Reboot machine.
  - Install Android 8.0 (Oreo) from the settings. Tools > SDK Manager > System Settings > Android SDK
  - Install device PIXEL 2 API 26 from the device manager. Tools > Device manager

### For IOS

Figure it out yourself, use Xcode or something

### Disclaimer

    Becouse of API restrictions IOS and Android application don't have access to use the map.

## To do / Comming

- Make markers/location shareable
- Add the markers to a calender.
