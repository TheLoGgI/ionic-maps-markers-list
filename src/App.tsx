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
import { ellipse, list, map } from "ionicons/icons"
import { Redirect, Route } from "react-router-dom"

import Tab1 from "./pages/Tab1"
import Tab2 from "./pages/Tab2"
import Tab3 from "./pages/Tab3"
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
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/map">
            <Tab3 />
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
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={ellipse} />
            <IonLabel>Tab 2</IonLabel>
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
