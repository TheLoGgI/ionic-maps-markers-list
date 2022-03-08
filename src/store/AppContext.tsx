import React, { createContext, useContext, useEffect, useReducer } from "react"

import { MapMarkerType } from "../components/Map"
import useStorage from "../hooks/useStorage"

type StoreState = {
  locations: MapMarkerType[]
}

type PayloadOptions = MapMarkerType | MapMarkerType[] | number

type ReducerActionType = {
  type: string
  payload: any
}

const initialState: StoreState = {
  locations: [],
}

// TODO: Type action and payloadOptions
// TODO: move localstorage operations to this file toghter with state
const reducers = (state: StoreState, action: ReducerActionType) => {
  switch (action.type) {
    case "update-map-markers":
      return {
        ...state,
        locations: [...action.payload],
      }
    case "update-map-marker":
      const indexToUpdate = state.locations.findIndex(
        (location) => (location.id = action.payload.id)
      )
      if (indexToUpdate !== -1) {
        state.locations[indexToUpdate] = {
          ...state.locations[indexToUpdate],
          date: action.payload.date,
        }
      }
      return {
        ...state,
      }
    case "set-map-markers":
      return {
        ...state,
        locations: [...state.locations, action.payload],
      }
    case "delete-map-marker":
      state.locations.splice(action.payload, 1)
      return {
        ...state,
        locations: [...state.locations],
      }
    default:
      return state
  }
}

export interface StoreContextState {
  state: StoreState
  dispatch: React.Dispatch<any>
}

const StoreContext = createContext<StoreContextState>({
  state: initialState,
  dispatch: () => undefined,
})

export const StoreContextProvider: React.FC = (props) => {
  const [store, dispatch] = useReducer(reducers, initialState)
  const { getLocationStorage } = useStorage()

  useEffect(() => {
    ;(async () => {
      const locations = await getLocationStorage()
      dispatch({ type: "update-map-markers", payload: locations })
    })()
  }, [getLocationStorage])

  return (
    <StoreContext.Provider value={{ state: store, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStoreContext = () => {
  return useContext(StoreContext)
}
