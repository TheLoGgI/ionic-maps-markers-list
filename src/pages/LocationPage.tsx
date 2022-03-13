import "./LocationPage.css"

import { Camera } from "@capacitor/camera"
import { Toast } from "@capacitor/toast"
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
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
      <IonButton color="secondary" className="my-4" onClick={handleButton}>
        <IonIcon color="light" icon={imageOutline} className="mr-2" />
        <IonText color="light">Add photos</IonText>
      </IonButton>
    </div>
  )
}

const LocationPage: React.FC = () => {
  const { state } = useStoreContext()
  const [isLoading, setIsloading] = React.useState(false)
  const [photos, setPhotos] = React.useState<ImageDBType[]>([])

  const { placeId } = useParams<{ placeId: string }>()
  const location = state.locations.find(
    (location) => location.placeId === placeId
  )

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
        console.log("photo: ", photo)

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
        console.log("blob: ", imageBlob)

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
            <div className="flex justify-between items-center w-full">
              <IonText className="truncate">{location?.address}</IonText>
              <IonButton
                color="secondary"
                className="ion-margin-vertical"
                onClick={takePicture}
              >
                <IonIcon color="light" icon={imageOutline} />
              </IonButton>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={isLoading} />
        {photos.map((photo, i) => (
          <IonCard key={photo.name + i}>
            <IonCardContent>
              <IonItem>
                <IonLabel>
                  Date:{" "}
                  {location?.date /* Should come from metadata of the images */}
                </IonLabel>
              </IonItem>
              <img src={photo.url} alt="" />
            </IonCardContent>
          </IonCard>
        ))}

        {photos.length === 0 && <ImageFallback handleButton={takePicture} />}
      </IonContent>
    </IonPage>
  )
}

export default LocationPage
