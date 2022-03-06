import "../theme/googleMaps.info.style.css"

import { Geolocation } from "@capacitor/geolocation"
import { Wrapper } from "@googlemaps/react-wrapper"
import { IonAlert } from "@ionic/react"
import React, { useContext, useEffect } from "react"

import useStorage from "../hooks/useStorage"
import { StoreContext } from "../store/AppContext"

export interface Location {
  id: number
  name?: string
  lat: number
  lng: number
}

export type MapMarkerType = {
  coordinates: { lat: number; lng: number }
  name: string
  address: string
  placeId: string
}

interface MapProps {
  locations: MapMarkerType[]
  mapCenter: Location
  setMapMarkers: (mapMarkers: MapMarkerType) => void
  deleteMarker: (index: number) => void
}

const mapStyles = {
  postion: "absolute",
  height: "100%",
  width: "100%",
  backgroundColor: "transparent",
  opacity: 1,
}

const Map: React.FC = () => {
  const store = useContext(StoreContext)

  const setMapMarkers = (state: any) => {
    store.dispatch({ type: "set-map-markers", payload: state })
  }
  const deleteMarker = (index: number) => {
    store.dispatch({ type: "delete-map-marker", payload: index })
  }

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <MapView
        locations={store.state.locations}
        mapCenter={{
          id: 1,
          name: "Map Center",
          lat: 43.071584,
          lng: -89.38012,
        }}
        setMapMarkers={setMapMarkers}
        deleteMarker={deleteMarker}
      />
    </Wrapper>
  )
}

const MapView: React.FC<MapProps> = ({
  mapCenter,
  locations,
  setMapMarkers,
  deleteMarker,
}) => {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<google.maps.Map>()
  const [alertInfo, setAlertInfo] = React.useState({
    lat: map?.getCenter().lat() || 0,
    lng: map?.getCenter().lng() || 0,
  })
  const [showAlert, setShowAlert] = React.useState(false)
  const [currentPostion, setCurrentPossition] =
    React.useState<GeolocationPosition>({
      coords: { latitude: 55.805904, longitude: 9.469118 },
    } as GeolocationPosition)
  const { setLocationStorage, updateLocationStorage } = useStorage()
  const geocoder = new google.maps.Geocoder()

  // Paint markers from the store / previeous vistet
  const addMarkers = React.useCallback(() => {
    locations.forEach((markerData, index) => {
      let infoWindow = new google.maps.InfoWindow({
        content: `<h4>${markerData.name}</h4>`,
      })

      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          markerData.coordinates.lat,
          markerData.coordinates.lng
        ),
        map: map!,
      })
      // TODO: UPDATE MARKER NAME

      // Open marker on click
      marker.addListener("click", () => {
        infoWindow.open(map!, marker)
      })

      // Delete Marker
      marker.addListener("dblclick", (e) => {
        deleteMarker(index)
        marker.setMap(null)
        updateLocationStorage(locations)
      })
    })
  }, [deleteMarker, locations, map, updateLocationStorage])

  // Add new markers to map
  function addMarker(latLng: { lat: number; lng: number }, name: string) {
    const markerCommonProps = {
      coordinates: latLng,
      name: name,
    }

    geocoder.geocode({ location: latLng }, (results, status) => {
      // TODO: sort out "plus_code" in foratted_address, perhaps useing address_components

      console.log("results: ", results)
      if (status === "OK" && results[0]) {
        const markerWIthAdress = {
          ...markerCommonProps,
          address: results[0].formatted_address,
          placeId: results[0].place_id,
        }
        // Update store, marker with address
        setMapMarkers(markerWIthAdress)
        setLocationStorage(markerWIthAdress)
      } else {
        const markerWithoutAddress = {
          ...markerCommonProps,
          address: "",
          placeId: `${latLng.lat}-${latLng.lng}`,
        }
        // Update store, marker without address
        setLocationStorage(markerWithoutAddress)
        setMapMarkers(markerWithoutAddress)
      }
    })
  }

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

    // Use the Geolocation API to get the current position
    try {
      Geolocation.getCurrentPosition().then((position) => {
        setCurrentPossition(position as GeolocationPosition)
      })
    } catch (error) {
      console.error(error)
    }
  }, [
    mapRef,
    map,
    mapCenter.lat,
    mapCenter.lng,
    currentPostion?.coords.latitude,
    currentPostion?.coords.longitude,
  ])

  useEffect(() => {
    // Add previous markers to map
    addMarkers()

    // Listen for clicks on Map and Add new markers to map
    map?.addListener("click", async (e) => {
      setAlertInfo({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      setShowAlert(true)
    })
  }, [
    mapCenter,
    locations,
    locations.length,
    setMapMarkers,
    map,
    alertInfo,
    addMarkers,
  ])

  return (
    <div ref={mapRef} style={mapStyles}>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="my-custom-class"
        header={"Who do you associate with this location?"}
        inputs={[
          {
            name: "name",
            type: "text",
            placeholder: "Enter name",
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
              addMarker(alertInfo, e.name)
              setShowAlert(false)
            },
          },
        ]}
      />
    </div>
  )
}

export default Map
