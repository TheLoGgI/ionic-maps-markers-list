import "./Tab1.css"

import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { useContext } from "react"
import React from "react"

import ExploreContainer from "../components/ExploreContainer"
import { StoreContext } from "../store/AppContext"

const Tab1: React.FC = () => {
  const store = useContext(StoreContext)
  console.log("store: ", store)
  // store.dispatch({ type: "set-map-markers", payload: ["asddas"] })

  // React.useEffect(() => {
  // }, [store])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Collected Locations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {store.state.locations.length === 0 ? (
          <IonText className="mt-20 text-center">
            You have no markers placed
          </IonText>
        ) : (
          <IonList>
            <IonListHeader>
              <IonTitle>Friend</IonTitle>
              <IonTitle>LatLng</IonTitle>
              <IonTitle>Location</IonTitle>
            </IonListHeader>
            {store.state.locations.map((location, i) => (
              <IonItem key={i}>
                <IonListHeader>
                  <IonLabel>{location.name}</IonLabel>
                  <IonLabel>
                    <IonLabel>lat: {location.coordinates.lat}</IonLabel>
                    <IonLabel>
                      lng:
                      {location.coordinates.lng}
                    </IonLabel>
                  </IonLabel>
                  <IonText className="break-words">{location.address}</IonText>
                </IonListHeader>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Tab1
