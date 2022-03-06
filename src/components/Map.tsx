import "../theme/googleMaps.info.style.css"

import { Wrapper } from "@googlemaps/react-wrapper"
import { IonAlert } from "@ionic/react"
import React, { useContext, useEffect } from "react"

import useAxiosFetch from "../hooks/useAxios"
import useReverseLatLng from "../hooks/useReverseLatLng"
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

  navigator.geolocation.getCurrentPosition((position) =>
    setCurrentPossition(position)
  )
  const geocoder = new google.maps.Geocoder()
  // const latlngObject = React.useMemo(
  //   () => ({
  //     lat: currentPostion.coords.latitude,
  //     lng: currentPostion.coords.longitude,
  //   }),
  //   [currentPostion]
  // )
  // const { data: addressData, isFetched } = useReverseLatLng(latlngObject)

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
      })
    })
  }, [deleteMarker, locations, map])

  // Add new markers to map
  function addMarker(latLng: { lat: number; lng: number }, name: string) {
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        // Update store, marker with address
        setMapMarkers({
          coordinates: latLng,
          name: name,
          address: results[0].formatted_address,
        })
      } else {
        // Update store, marker without address
        setMapMarkers({
          coordinates: { lat: latLng.lat, lng: latLng.lng },
          name: name,
          address: "",
        })
      }
    })

    // setCurrentPossition({
    //   coords: {
    //     latitude: latLng.lat,
    //     longitude: latLng.lng,
    //   },
    // } as GeolocationPosition)
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
