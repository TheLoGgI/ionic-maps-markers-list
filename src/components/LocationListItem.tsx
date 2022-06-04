import {
  IonAvatar,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonRouterLink,
} from "@ionic/react"

import { MapMarkerType } from "./Map"

type LocationListItemProps = {
  title: string
  locations: MapMarkerType[]
  show: boolean
}

const LocationListItem: React.FC<LocationListItemProps> = ({
  title,
  locations,
  show,
}) => {
  if (!show) return null

  return (
    <>
      <IonItemDivider>
        <IonLabel>{title}</IonLabel>
      </IonItemDivider>
      {locations.map((location, index) => (
        <IonRouterLink
          key={index}
          color="dark"
          href={`location/${location.placeId}`}
        >
          <IonItem>
            <IonAvatar slot="start">
              <img
                src={
                  location.country !== ""
                    ? `https://countryflagsapi.com/png/${location.country}`
                    : "https://upload.wikimedia.org/wikipedia/commons/2/2f/Missing_flag.png"
                }
                alt={location.country}
              />
            </IonAvatar>
            <IonLabel>
              <h2>{location.address}</h2>
              <p>
                {title === "Visited" ? "Visited on " : "Planned for "}
                {new Date(location.date).toLocaleDateString("da-dk", {
                  dateStyle: "medium",
                })}
              </p>
            </IonLabel>
          </IonItem>
        </IonRouterLink>
      ))}
    </>
  )
}

export default LocationListItem
