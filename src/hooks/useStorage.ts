import { Storage } from "@capacitor/storage"
import { useCallback } from "react"

import { MapMarkerType } from "../components/Map"

const useStorage = () => {
  const getLocationStorage = useCallback(async (): Promise<MapMarkerType[]> => {
    const { value } = await Storage.get({ key: "location" })
    if (typeof value === "string") return JSON.parse(value)
    return []
  }, [])

  const addLocationStorage = async (obj: MapMarkerType) => {
    const { value } = await Storage.get({ key: "location" })
    if (typeof value === "string") {
      await Storage.set({
        key: "location",
        value: JSON.stringify([...JSON.parse(value), obj]),
      })
    } else {
      await Storage.set({
        key: "location",
        value: JSON.stringify([obj]),
      })
    }
  }

  const updateLocationStorage = async (obj: MapMarkerType) => {
    const { value } = await Storage.get({ key: "location" })
    if (typeof value === "string") {
      const locations = JSON.parse(value)
      const newLocations = locations.map((location: MapMarkerType) =>
        location.id === obj.id ? obj : location
      )
      await Storage.set({
        key: "location",
        value: JSON.stringify(newLocations),
      })
    }
  }

  const updateLocationsStorage = async (obj: MapMarkerType[]) => {
    await Storage.set({
      key: "location",
      value: JSON.stringify(obj),
    })
  }

  const deleteItemLocationStorage = async (index: number) => {
    const { value } = await Storage.get({ key: "location" })
    if (typeof value === "string") {
      JSON.parse(value).splice(index, 1)
      await Storage.set({
        key: "location",
        value: JSON.stringify(value),
      })
      return true
    }
    return false
  }

  return {
    getLocationStorage,
    addLocationStorage,
    updateLocationStorage,
    updateLocationsStorage,
    deleteItemLocationStorage,
  }
}

export default useStorage
