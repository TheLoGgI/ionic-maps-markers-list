import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonPage,
  IonRouterLink,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import React from "react"

import ExploreContainer from "../components/ExploreContainer"
import { useStoreContext } from "../store/AppContext"

const Tab1: React.FC = () => {
  const { state } = useStoreContext()

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
          <IonGrid>
            <IonRow className="text-sm font-bold border-b-2">
              <IonCol size="3">
                <p>Date</p>
              </IonCol>
              <IonCol size="5">
                <p>LatLng</p>
              </IonCol>
              <IonCol>
                <p>Address</p>
              </IonCol>
            </IonRow>
            {state.locations.map((location, index) => (
              <IonRouterLink
                key={index}
                color="dark"
                href={`location/${location.placeId}`}
              >
                <IonRow className="border-b-2">
                  <IonCol size="3">{location.date}</IonCol>
                  <IonCol size="5">
                    <div className="flex flex-col">
                      <IonLabel>lat: {location.coordinates.lat}</IonLabel>
                      <IonLabel>lng: {location.coordinates.lng} </IonLabel>
                    </div>
                  </IonCol>
                  <IonCol>{location.address}</IonCol>
                </IonRow>
              </IonRouterLink>
            ))}
          </IonGrid>

          // {state.locations.map((location, i) => (
          //   <IonItem key={i} routerLink={`location/${location.placeId}`}>
          //     <IonListHeader>
          //       <IonLabel>{location.date}</IonLabel>
          //       <IonLabel>
          //         <IonLabel>lat: {location.coordinates.lat}</IonLabel>
          //         <IonLabel>
          //           lng:
          //           {location.coordinates.lng}
          //         </IonLabel>
          //       </IonLabel>
          //       <IonText className="break-words">{location.address}</IonText>
          //     </IonListHeader>
          //   </IonItem>
          // ))}
        )}
      </IonContent>
    </IonPage>
  )
}

export default Tab1
