/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/* Theme variables */
import "./theme/variables.css"
import "./theme/main.css"

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { list, map } from "ionicons/icons"
import { Redirect, Route } from "react-router-dom"

import CollectionPage from "./pages/CollectionPage"
import LocationPage from "./pages/LocationPage"
import MapPage from "./pages/MapPage"
import { StoreContextProvider } from "./store/AppContext"

setupIonicReact()

const App: React.FC = () => {
  return (
    <StoreContextProvider>
      <IonicApp />
    </StoreContextProvider>
  )
}

const IonicApp: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/list">
            <CollectionPage />
          </Route>
          <Route path="/map">
            <MapPage />
          </Route>
          <Route path="/location/:placeId">
            <LocationPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/list" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="list" href="/list">
            <IonIcon icon={list} />
            <IonLabel>List</IonLabel>
          </IonTabButton>
          <IonTabButton tab="map" href="/map">
            <IonIcon icon={map} />
            <IonLabel>Map</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
)

export default App
