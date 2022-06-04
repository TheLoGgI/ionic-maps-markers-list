import { Camera } from "@capacitor/camera"
import { Toast } from "@capacitor/toast"
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react"
import { ref as dbRef, onValue, push } from "firebase/database"
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage"
import { imageOutline } from "ionicons/icons"
import React, { useEffect } from "react"
import { useParams } from "react-router"
import { useHistory } from "react-router-dom"

import { MapMarkerType } from "../components/Map"
import { db, storage } from "../firebase"
import { useStoreContext } from "../store/AppContext"

type ImageDBType = {
  url: string
  name: string
  locationId: string
}

function ImageFallback({ handleButton }: { handleButton: () => void }) {
  return (
    <div className="container">
      <IonText color="medium" className="ion-margin-bottom block">
        Share photos of your trip
      </IonText>
      <IonButton color="primary" className="btn-photo" onClick={handleButton}>
        <IonIcon icon={imageOutline} />
        <IonText className="ml-4">Add photos</IonText>
      </IonButton>
    </div>
  )
}

function staticMap(lat: number, lng: number) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=8&size=500x500&markers=color:blue|${lat},${lng}&key=AIzaSyAuhATUKdxNac1FGR5zlADZoIqoRuD8x7Q`
}

const LocationPage: React.FC = () => {
  const { state, dispatch } = useStoreContext()
  const [isLoading, setIsloading] = React.useState(false)
  const [photos, setPhotos] = React.useState<ImageDBType[]>([])
  const [showUpdateAlert, setShowUpdateAlert] = React.useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const history = useHistory()
  // const { updateLocationStorage, deleteItemLocationStorage } = useStorage()

  const { placeId } = useParams<{ placeId: string }>()
  const location = state.locations.find(
    (location) => location.placeId === placeId
  )
  const locationIndex = state.locations.indexOf(location as MapMarkerType)

  const isDateOld =
    new Date(location?.date as string).getTime() - new Date().getTime() < 0

  useEffect(() => {
    if (!location) return
    const starCountRef = dbRef(db, `photos/${location ? location.id : ""}`)
    setIsloading(true)
    onValue(starCountRef, (snapshot) => {
      const data: ImageDBType[] = snapshot.val()
      if (data !== null) {
        const formatData = Object.values(data)
        setPhotos(formatData)
      }
    })

    setIsloading(false)
  }, [location])

  async function takePicture() {
    const imageOptions = {
      quality: 80,
      width: 500,
      limit: 5,
    }

    const images = await Camera.pickImages(imageOptions)

    setIsloading(true)
    if (images.photos.length > 0) {
      images.photos.forEach(async (photo) => {
        // Get unique identifier from image path
        const photopathArr = photo.webPath.split("/")
        const photoId = photopathArr[photopathArr.length - 1]

        // Create reference to image in storage
        const newImageRef = storageRef(
          storage,
          `${location?.id}/${photoId}.${photo.format}`
        )

        // Fetch image from temporarily url and convert to blob
        const imageBlob = await fetch(photo.webPath).then((r) => r.blob())

        // Upload image to firebase storage
        const snapshot = await uploadBytes(newImageRef, imageBlob, {
          contentType: photo.format,
        })

        // Get downloadable url from firebase storage
        const photoUrl = await getDownloadURL(newImageRef)

        // Add photo data to Realtime firebase
        push(dbRef(db, `photos/${location?.id}`), {
          url: photoUrl,
          name: snapshot.metadata.name,
          locationId: location?.id,
        })
      })
    } else {
      await Toast.show({
        text: "Something went wrong",
        duration: "long",
      })
    }
    setIsloading(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div className="location-header-titel">
              <IonText className="truncate">{location?.country}</IonText>
              <IonButtons>
                <IonButton
                  onClick={() => setShowUpdateAlert(true)}
                  fill="clear"
                >
                  Update date
                </IonButton>
                <IonButton fill="solid" color="primary" onClick={takePicture}>
                  <IonIcon icon={imageOutline} />
                  <IonText className="ml-2">Add photos</IonText>
                </IonButton>
              </IonButtons>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {location !== undefined && (
          <IonImg
            src={staticMap(location.coordinates.lat, location.coordinates.lng)}
            alt="image"
          />
        )}
        <IonGrid className="location-details-header">
          <IonRow>
            <IonCol>
              <IonRow>
                <b>Coordinates</b>
              </IonRow>
              <IonRow>
                <IonCol>lat: {location?.coordinates.lat}</IonCol>
              </IonRow>
              <IonRow>
                <IonCol>lng: {location?.coordinates.lng}</IonCol>
              </IonRow>
            </IonCol>
            <IonCol>
              {location !== undefined && (
                <IonRow>
                  <IonCol>
                    <b>{isDateOld ? "Visited: " : "Planning for: "}</b>
                    {new Date(location.date).toLocaleDateString("da-DK", {
                      dateStyle: "long",
                    })}
                  </IonCol>
                </IonRow>
              )}
              <IonRow>
                <IonCol>
                  <b>Adress:</b> {location?.address}
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonLoading isOpen={isLoading} />
        {photos.map((photo, i) => (
          <IonCard key={photo.name + i}>
            <IonCardContent>
              <IonImg key={photo.name + i} src={photo.url} alt="image" />
            </IonCardContent>
          </IonCard>
        ))}

        {photos.length === 0 && <ImageFallback handleButton={takePicture} />}
        <IonFooter className="footer-padding">
          <IonToolbar className="bg-toolbar">
            <IonButtons slot="end" className="m-auto">
              <IonButton
                color="danger"
                onClick={() => setShowDeleteAlert(true)}
              >
                Delete location
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonFooter>
      </IonContent>
      <IonAlert
        isOpen={showUpdateAlert}
        onDidDismiss={() => setShowUpdateAlert(false)}
        header={"When do you plan to go?"}
        inputs={[
          {
            name: "date",
            type: "date",
            value: location?.date,
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
            text: "Update marker",
            cssClass: "btn-update",
            handler: (e) => {
              dispatch({
                type: "update-map-marker",
                payload: { date: e.date, id: location?.id },
              })
            },
          },
        ]}
      />
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Are you sure you want to delete this location?"
        buttons={[
          {
            text: "No, not yet",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Delete location",
            cssClass: "btn-delete",
            handler: (e) => {
              dispatch({ type: "delete-map-marker", payload: locationIndex })
              history.push("/list")
            },
          },
        ]}
      />
    </IonPage>
  )
}

export default LocationPage
