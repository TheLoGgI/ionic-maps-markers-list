import {
  IonContent,
  IonHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import React, { useEffect } from "react"

import Map, { MapMarkerType } from "../components/Map"
import { useStoreContext } from "../store/AppContext"

const MapPage: React.FC = () => {
  const { dispatch, state } = useStoreContext()
  const [filteredLocations, setFilteredLocations] = React.useState<
    MapMarkerType[]
  >(state.locations)

  useEffect(() => {
    setFilteredLocations(state.locations)
  }, [state.locations])

  const handleSegmentChange = (e: CustomEvent) => {
    const newFilter = e.detail.value
    dispatch({ type: "update-filter", payload: newFilter })

    switch (newFilter) {
      case "visited":
        const visited = state.locations
          .filter((val) => new Date(val.date).getTime() < new Date().getTime())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        setFilteredLocations(visited)
        break
      case "planning":
        const planned = state.locations
          .filter((val) => new Date(val.date).getTime() > new Date().getTime())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        setFilteredLocations(planned)
        break

      default:
        setFilteredLocations(state.locations)
        break
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
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
        <Map filteredLocations={filteredLocations} />
      </IonContent>
    </IonPage>
  )
}

export default MapPage
