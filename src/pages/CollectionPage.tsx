import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonRouterLink,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import React from "react"

import ExploreContainer from "../components/ExploreContainer"
import LocationListItem from "../components/LocationListItem"
import { useStoreContext } from "../store/AppContext"

const CollectionPage: React.FC = () => {
  const { state, dispatch } = useStoreContext()

  const visited = state.locations
    .filter((val) => new Date(val.date).getTime() < new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const planned = state.locations
    .filter((val) => new Date(val.date).getTime() > new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  function handleSegmentChange(e: CustomEvent) {
    const newFilter = e.detail.value
    dispatch({ type: "update-filter", payload: newFilter })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Collected Locations</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={state.filterString}
            onIonChange={handleSegmentChange}
          >
            <IonSegmentButton value="all">All</IonSegmentButton>
            <IonSegmentButton value="visited">Visited</IonSegmentButton>
            <IonSegmentButton value="planning">Planning</IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {state.locations.length === 0 ? (
          <ExploreContainer name="You have no markers placed" />
        ) : (
          <IonList>
            <LocationListItem
              title="Visted"
              locations={visited}
              show={
                state.filterString === "all" || state.filterString === "visited"
              }
            />
            <LocationListItem
              title="Comming up"
              locations={planned}
              show={
                state.filterString === "all" ||
                state.filterString === "planning"
              }
            />
          </IonList>
        )}
      </IonContent>
    </IonPage>
  )
}

export default CollectionPage
