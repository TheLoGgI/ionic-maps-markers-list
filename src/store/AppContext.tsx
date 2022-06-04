import { ref as dbRef, onValue, set } from "firebase/database"
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react"

import { MapMarkerType } from "../components/Map"
import { db } from "../firebase"
import useStorage from "../hooks/useStorage"

type StoreState = {
  locations: MapMarkerType[]
  filterString: string
}

type ReducerActionType = {
  type: string
  payload: any
}

const initialState: StoreState = {
  locations: [],
  filterString: "all",
}

const reducers = (state: StoreState, action: ReducerActionType) => {
  switch (action.type) {
    case "update-filter":
      return {
        ...state,
        filterString: action.payload,
      }
    case "update-map-markers":
      return {
        ...state,
        locations: [...action.payload],
      }
    case "update-map-marker":
      const indexToUpdate = state.locations.findIndex(
        (location) => location.id === action.payload.id
      )

      if (indexToUpdate !== -1) {
        state.locations[indexToUpdate] = {
          ...state.locations[indexToUpdate],
          date: action.payload.date,
        }
        set(dbRef(db, `markers`), {
          ...state.locations,
        })
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
      set(dbRef(db, `markers`), {
        ...state.locations,
      })
      return {
        ...state,
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

export const StoreContextProvider = (props: {
  children?: ReactNode | undefined
}) => {
  const [store, dispatch] = useReducer(reducers, initialState)
  const [markerState, setMarkerState] = React.useState([])

  const { getLocationStorage, updateLocationsStorage } = useStorage()

  useEffect(() => {
    const starCountRef = dbRef(db, `markers`)
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val()
      if (data) setMarkerState(Object.values(data))
    })
  }, [])

  useEffect(() => {
    ;(async () => {
      const locations = await getLocationStorage()

      if (markerState.length !== locations.length) {
        updateLocationsStorage(markerState)
      }
      dispatch({
        type: "update-map-markers",
        payload: markerState.length > 0 ? markerState : locations,
      })
    })()
  }, [getLocationStorage, markerState, updateLocationsStorage])

  return (
    <StoreContext.Provider value={{ state: store, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export const useStoreContext = () => {
  return useContext(StoreContext)
}
