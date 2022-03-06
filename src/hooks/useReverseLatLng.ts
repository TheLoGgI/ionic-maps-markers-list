import useAxiosFetch from "./useAxios"

type latlng = { lat: number; lng: number }

function useReverseLatLng({ lat, lng }: latlng) {
  const query = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}
    &location_type=ROOFTOP&result_type=street_address|route|country&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`

  return useAxiosFetch(query)
}

export default useReverseLatLng
