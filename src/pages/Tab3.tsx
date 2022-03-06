import "./Tab3.css"

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react"

import Map from "../components/Map"

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Map />
      </IonContent>
    </IonPage>
  )
}

export default Tab3
