import "./Tab1.css"

import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRouterLink,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react"
import { useContext } from "react"
import React from "react"

import ExploreContainer from "../components/ExploreContainer"
import useStorage from "../hooks/useStorage"
import { StoreContext } from "../store/AppContext"

const Tab1: React.FC = () => {
  const { state } = useContext(StoreContext)
  // const { getLocationStorage } = useStorage()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Collected Locations</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {state.locations.length === 0 ? (
          <ExploreContainer name="You have no markers placed" />
        ) : (
          <IonList>
            <IonListHeader>
              <IonTitle>Friend</IonTitle>
              <IonTitle>LatLng</IonTitle>
              <IonTitle>Location</IonTitle>
            </IonListHeader>
            {state.locations.map((location, i) => (
              <IonItem key={i} routerLink={`location/${location.placeId}`}>
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
