import "./LocationPage.css"

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import React from "react"
import { useParams } from "react-router"

import { useStoreContext } from "../store/AppContext"

const LocationPage: React.FC = () => {
  const { state } = useStoreContext()
  console.log("state: ", state)
  const { placeId } = useParams<{ placeId: string }>()
  const location = state.locations.find(
    (location) => location.placeId === placeId
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Location: {location?.address}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen></IonContent>
    </IonPage>
  )
}

export default LocationPage
