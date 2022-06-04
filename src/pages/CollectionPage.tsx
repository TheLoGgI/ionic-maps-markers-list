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
    console.log("newFilter: ", newFilter)
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
            {(state.filterString === "all" ||
              state.filterString === "visited") && (
              <>
                <IonItemDivider>
                  <IonLabel>Visited</IonLabel>
                </IonItemDivider>
                {visited.map((location, index) => (
                  <IonRouterLink
                    key={index}
                    color="dark"
                    href={`location/${location.placeId}`}
                  >
                    <IonItem>
                      <IonAvatar slot="start">
                        <img
                          src={`https://countryflagsapi.com/png/${location.country}`}
                          alt="asdads"
                        />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{location.address}</h2>
                        <p>
                          Visited on{" "}
                          {new Date(location.date).toLocaleDateString("da-dk", {
                            dateStyle: "medium",
                          })}
                        </p>
                      </IonLabel>
                    </IonItem>
                  </IonRouterLink>
                ))}
              </>
            )}

            {(state.filterString === "all" ||
              state.filterString === "planning") && (
              <>
                <IonItemDivider>
                  <IonLabel>Comming up</IonLabel>
                </IonItemDivider>
                {planned.map((location, index) => (
                  <IonRouterLink
                    key={index}
                    color="dark"
                    href={`location/${location.placeId}`}
                  >
                    <IonItem>
                      <IonAvatar slot="start">
                        <img
                          src={`https://countryflagsapi.com/png/${location.country}`}
                          alt="asdads"
                        />
                      </IonAvatar>
                      <IonLabel>
                        <h2>{location.address}</h2>
                        <p>
                          Planned for{" "}
                          {new Date(location.date).toLocaleDateString("da-dk", {
                            dateStyle: "medium",
                          })}
                        </p>
                      </IonLabel>
                    </IonItem>
                  </IonRouterLink>
                ))}
              </>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  )
}

export default CollectionPage
