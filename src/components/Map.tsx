import "../theme/googleMaps.info.style.css"

import { Geolocation } from "@capacitor/geolocation"
import { Wrapper } from "@googlemaps/react-wrapper"
import { IonAlert } from "@ionic/react"
import { ref as dbRef, set } from "firebase/database"
import React, { useCallback, useEffect } from "react"

import { db } from "../firebase"
import { useStoreContext } from "../store/AppContext"

export type MapMarkerType = {
  coordinates: { lat: number; lng: number }
  date: string
  address: string
  placeId: string
  country: string
  id: string
}

interface MapProps {
  locations: MapMarkerType[]
  setMapMarkers: (mapMarkers: MapMarkerType) => void
}

function findLocationName(results: google.maps.GeocoderResult[]) {
  for (let i = 0; i < results.length; i++) {
    const element = results[i]
    if (
      element.types.includes("establishment") ||
      element.types.includes("postal_code") ||
      element.types.includes("locality")
    ) {
      return element.formatted_address
    }
  }
}

const createMarkerContent = (
  date: string,
  address: string,
  placeId: string
) => {
  const daysSince =
    (new Date(date).getTime() - new Date().getTime()) / 86_400_000 // 86_400_000 = 60 * 60 * 24 * 1000 = 1 day

  const isDateOld = daysSince < 0
  const hoursLeft = (Math.abs(daysSince % 1) * 24).toFixed(0)
  const daysLeft = Math.abs(daysSince).toFixed(0)
  const timeLeftString = isDateOld
    ? `You visted ${daysLeft} days and ${hoursLeft} hours ago`
    : `You will visit in ${daysLeft} days and ${hoursLeft} hours`
  // Math.floor(24 * (Number(k.split(".")[1]) / 100))
  return `
  <h3 >${isDateOld ? "Went " : "Plan on going "}  ${new Date(
    date
  ).toLocaleDateString("da-dk", {
    dateStyle: "long",
  })}</h3>
  <b>To: </b>
  <p>${address}</p>
  <b>${isDateOld ? "Days since trip:" : "Days until trip:"} </b>
  <p>${timeLeftString} </p>
  <a href="${
    window.location.origin
  }/location/${placeId}" class="btn-info-window">Visite location page</a>
  `
}

const Map: React.FC<{ filteredLocations: MapMarkerType[] }> = ({
  filteredLocations,
}) => {
  const { dispatch } = useStoreContext()

  const setMapMarkers = (state: any) => {
    dispatch({ type: "set-map-markers", payload: state })
  }

  return (
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <MapView locations={filteredLocations} setMapMarkers={setMapMarkers} />
    </Wrapper>
  )
}

const MapView: React.FC<MapProps> = ({ locations, setMapMarkers }) => {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<google.maps.Map>()
  const [showCreateMarkerAlert, setShowCreateMarkerAlert] =
    React.useState(false)

  const displayedMapMarkers = React.useRef<google.maps.Marker[]>([])

  const getCenter = map?.getCenter()
  const [alertInfo, setAlertInfo] = React.useState({
    lat: getCenter ? getCenter.lat() : 0,
    lng: getCenter ? getCenter.lng() : 0,
  })

  // Sets the map on all markers in the array.
  // https://developers.google.com/maps/documentation/javascript/examples/marker-remove
  const resetMapMarkers = useCallback(() => {
    for (let i = 0; i < displayedMapMarkers.current.length; i++) {
      displayedMapMarkers.current[i].setMap(null)
    }
    displayedMapMarkers.current = []
  }, [displayedMapMarkers])

  const [currentPostion, setCurrentPossition] =
    React.useState<GeolocationPosition>({
      coords: { latitude: 55.805904, longitude: 9.469118 },
    } as GeolocationPosition)

  const geocoder = new google.maps.Geocoder()

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

  // Paint markers from the store / previeous vistet
  const addMarkers = React.useCallback(() => {
    // Add markers from the store
    locations.forEach((markerData, index) => {
      const isDateOld =
        new Date(markerData.date).getTime() < new Date().getTime()
      const contentString = createMarkerContent(
        markerData.date,
        markerData.address,
        markerData.placeId
      )

      const infoWindow = new google.maps.InfoWindow({
        content: contentString,
      })

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          markerData.coordinates.lat,
          markerData.coordinates.lng
        ),
        ...(isDateOld && {
          icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        }),
        title: markerData.address,
        map: map,
      })

      displayedMapMarkers.current.push(marker)

      // Open marker on click
      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })
    })
  }, [locations, map])

  // Add new markers to map
  function addMarker(latLng: { lat: number; lng: number }, date: string) {
    const markerProps = {
      coordinates: latLng,
      date,
      id: (Date.now() + latLng.lat + latLng.lng)
        .toString(16)
        .replaceAll(".", "-"),
      address: "",
      country: "",
      placeId: `${latLng.lat}-${latLng.lng}`,
    }

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results !== null) {
        markerProps.address =
          findLocationName(results) || results[0].formatted_address
        markerProps.placeId = results[0].place_id
        markerProps.country =
          results.find((o) => o.types.includes("country"))?.formatted_address ??
          ""
      }

      // Update state store and database with marker
      setMapMarkers(markerProps)
      set(dbRef(db, `markers/${markerProps?.placeId}`), markerProps)
      addMarkers()
    })
  }

  // Initilizing the map with the center point from the Geoloaction or
  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(
        new window.google.maps.Map(mapRef.current, {
          center: {
            lat: currentPostion?.coords.latitude,
            lng: currentPostion?.coords.longitude,
          },
          zoom: 6,
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
    resetMapMarkers()
    // Add previous markers to map
    addMarkers()

    // Listen for clicks on Map and Add new markers to map
    map?.addListener("click", async (e: any) => {
      setAlertInfo({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      setShowCreateMarkerAlert(true)
    })
  }, [map, addMarkers, resetMapMarkers])

  return (
    <div ref={mapRef} className="map-view">
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
    </div>
  )
}

export default Map
