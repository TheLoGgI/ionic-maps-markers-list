import React, { createContext, useContext, useEffect, useReducer } from "react"

import { MapMarkerType } from "../components/Map"
import useStorage from "../hooks/useStorage"

type StoreState = {
  locations: MapMarkerType[]
}

const initialState: StoreState = {
  locations: [],
}

const reducers = (state: StoreState, action: any) => {
  switch (action.type) {
    case "update-map-markers":
      return {
        ...state,
        locations: [...action.payload],
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

export const StoreContext = createContext<StoreContextState>({
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
