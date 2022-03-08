import "../theme/googleMaps.info.style.css"

import { Geolocation } from "@capacitor/geolocation"
import { Wrapper } from "@googlemaps/react-wrapper"
import { IonAlert } from "@ionic/react"
import React, { useCallback, useEffect } from "react"

import useStorage from "../hooks/useStorage"
import { useStoreContext } from "../store/AppContext"

export type MapMarkerType = {
  coordinates: { lat: number; lng: number }
  date: string
  address: string
  placeId: string
  id: string
}

interface MapProps {
  locations: MapMarkerType[]
  setMapMarkers: (mapMarkers: MapMarkerType) => void
  deleteMarker: (index: number) => void
  updateMarker: (mapMarkers: MapMarkerType, id: string) => void
}

const mapStyles = {
  postion: "absolute",
  height: "100%",
  width: "100%",
  backgroundColor: "transparent",
  opacity: 1,
}

const Map: React.FC = () => {
  const { dispatch, state } = useStoreContext()

  const setMapMarkers = (state: any) => {
    dispatch({ type: "set-map-markers", payload: state })
  }
  const updateMarker = (date: Partial<MapMarkerType>, id: string) => {
    dispatch({
      type: "update-map-marker",
      payload: { date, id },
    })
  }
  const deleteMarker = (index: number) => {
    dispatch({ type: "delete-map-marker", payload: index })
  }

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <MapView
        locations={state.locations}
        setMapMarkers={setMapMarkers}
        deleteMarker={deleteMarker}
        updateMarker={updateMarker}
      />
    </Wrapper>
  )
}

const MapView: React.FC<MapProps> = ({
  locations,
  setMapMarkers,
  updateMarker,
  deleteMarker,
}) => {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<google.maps.Map>()
  const [showCreateMarkerAlert, setShowCreateMarkerAlert] =
    React.useState(false)
  const [updatingMarker, setupdatingMarker] = React.useState<any>({})
  const [alertInfo, setAlertInfo] = React.useState({
    lat: map?.getCenter().lat() || 0,
    lng: map?.getCenter().lng() || 0,
  })

  const [updateMarkerAlert, setUpdateMarkerAlert] = React.useState({
    isOpen: false,
    date: "",
    id: "",
  })

  const [currentPostion, setCurrentPossition] =
    React.useState<GeolocationPosition>({
      coords: { latitude: 55.805904, longitude: 9.469118 },
    } as GeolocationPosition)
  const { addLocationStorage, updateLocationsStorage, updateLocationStorage } =
    useStorage()
  const geocoder = new google.maps.Geocoder()

  // Remove marker from the map
  const removeMarker = useCallback(
    (marker: google.maps.Marker, index: number) => {
      deleteMarker(index)
      marker.setMap(null)
      updateLocationsStorage(locations)
    },
    [deleteMarker, locations, updateLocationsStorage]
  )

  const createMarkerContent = (
    date: string,
    address: string,
    index: number
  ) => {
    return `<h4 class="text-lg">Plan on going ${new Date(
      date
    ).toLocaleDateString()}</h4>
    <p class="text-md">To: ${address}</p>
    <p class="text-md">Days until trip: ${
      ((new Date(date).getTime() - new Date().getTime()) / 86_400_000).toFixed(
        2
      ) // 86_400_000 = 60 * 60 * 24 * 1000 = 1 day
    }</p>
    <button id="delete-${index}" class="mt-2 p-2 bg-red-400">Delete marker</button>
    <button id="update-${index}" class="mt-2 p-2 bg-blue-400">Update marker</button>
    `
  }

  // Paint markers from the store / previeous vistet
  const addMarkers = React.useCallback(() => {
    locations.forEach((markerData, index) => {
      const contentString = createMarkerContent(
        markerData.date,
        markerData.address,
        index
      )

      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
      })

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          markerData.coordinates.lat,
          markerData.coordinates.lng
        ),
        map: map!,
      })

      // map?.bindTo("infowindow", infoWindow)
      infoWindow.addListener("domready", () => {
        document
          .getElementById(`delete-${index}`)
          ?.addEventListener("click", () => {
            removeMarker(marker, index)
          })
        document
          .getElementById(`update-${index}`)
          ?.addEventListener("click", () => {
            setupdatingMarker({ markerData, index, infoWindow })

            setUpdateMarkerAlert((state) => ({
              ...state,
              isOpen: true,
              date: markerData.date,
              id: markerData.id,
            }))
            infoWindow.notify("content")
          })
      })

      // Open marker on click
      marker.addListener("click", () => {
        infoWindow.open(map!, marker)
      })

      // Delete Marker
      marker.addListener("dblclick", (e) => {
        removeMarker(marker, index)
      })
    })
  }, [locations, map, removeMarker])

  // Add new markers to map
  function addMarker(latLng: { lat: number; lng: number }, date: string) {
    const markerCommonProps = {
      coordinates: latLng,
      date,
      id: (Date.now() + latLng.lat + latLng.lng).toString(16),
    }

    geocoder.geocode({ location: latLng }, (results, status) => {
      // TODO: sort out "plus_code" in foratted_address, perhaps useing address_components

      if (status === "OK" && results[0]) {
        const markerWIthAdress = {
          ...markerCommonProps,
          address: results[0].formatted_address,
          placeId: results[0].place_id,
        }

        // Update store, marker with address
        setMapMarkers(markerWIthAdress)
        console.log("markerWIthAdress: ", markerWIthAdress)
        addLocationStorage(markerWIthAdress)
      } else {
        const markerWithoutAddress = {
          ...markerCommonProps,
          address: "",
          placeId: `${latLng.lat}-${latLng.lng}`,
        }

        // Update store, marker without address
        addLocationStorage(markerWithoutAddress)
        setMapMarkers(markerWithoutAddress)
      }
    })
  }

  useEffect(() => {
    // Use the Geolocation API to get the current position
    try {
      Geolocation.getCurrentPosition().then((position) => {
        setCurrentPossition(position as GeolocationPosition)
      })
    } catch (error) {
      console.error(error)
    }
  }, [])

  // Initilizing the map with the center point from the Geoloaction or
  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(
        new window.google.maps.Map(mapRef.current, {
          center: {
            lat: currentPostion?.coords.latitude,
            lng: currentPostion?.coords.longitude,
          },
          zoom: 16,
          maxZoom: 16,
        })
      )
    }
  }, [
    mapRef,
    map,
    currentPostion?.coords.latitude,
    currentPostion?.coords.longitude,
  ])

  useEffect(() => {
    // Add previous markers to map
    addMarkers()

    // Listen for clicks on Map and Add new markers to map
    map?.addListener("click", async (e) => {
      setAlertInfo({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      setShowCreateMarkerAlert(true)
    })
  }, [locations, locations.length, setMapMarkers, map, alertInfo, addMarkers])

  return (
    <div ref={mapRef} style={mapStyles}>
      <IonAlert
        isOpen={showCreateMarkerAlert}
        onDidDismiss={() => setShowCreateMarkerAlert(false)}
        header={"When do you plan to go?"}
        inputs={[
          {
            name: "date",
            type: "date",
            placeholder: "Date of visit",
          },
        ]}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Ok",
            handler: (e) => {
              addMarker(alertInfo, e.date)
              setShowCreateMarkerAlert(false)
            },
          },
        ]}
      />
      <IonAlert
        isOpen={updateMarkerAlert.isOpen}
        onDidDismiss={() =>
          setUpdateMarkerAlert((state) => ({ ...state, isOpen: false }))
        }
        header={"When do you plan to go?"}
        inputs={[
          {
            name: "date",
            type: "date",
            value: updateMarkerAlert.date,
            placeholder: "Date of visit",
          },
        ]}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Ok",
            handler: (e) => {
              updateMarker(e.date, updateMarkerAlert.id)
              const contentString = createMarkerContent(
                e.date,
                updatingMarker.markerData.address,
                updatingMarker.markerData.index
              )

              updatingMarker.infoWindow?.setContent(contentString)
              updateLocationStorage({
                ...updatingMarker.markerData,
                date: e.date,
              })
            },
          },
        ]}
      />
    </div>
  )
}

export default Map
